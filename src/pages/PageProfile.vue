<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <!-- Profile Header -->
      <div class="profile-header q-pa-lg bg-grey-2">
        <div class="row items-center q-col-gutter-md">
          <div class="col-auto">
            <q-avatar size="120px">
              <img :src="profileData.avatar">
            </q-avatar>
          </div>
          <div class="col">
            <div class="text-h4 text-weight-bold">{{ profileData.name }}</div>
            <div class="text-h6 text-grey-7">@{{ profileData.username }}</div>
            <div class="text-body1 q-mt-sm">{{ profileData.bio }}</div>
            <div class="row q-mt-md q-gutter-md">
              <div class="text-body2">
                <span class="text-weight-bold">{{ userQweets.length }}</span>
                <span class="text-grey-7"> Qweets</span>
              </div>
              <div class="text-body2">
                <span class="text-weight-bold">{{ totalLikes }}</span>
                <span class="text-grey-7"> Likes Received</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <q-separator
        class="divider"
        color="grey-2"
        size="10px"
      />

      <!-- User's Qweets -->
      <div v-if="userQweets.length > 0">
        <q-list separator>
          <transition-group
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <q-item
              v-for="qweet in userQweets"
              :key="qweet.id"
              class="qweet q-py-md"
            >
              <q-item-section avatar top>
                <q-avatar size="xl">
                  <img :src="profileData.avatar">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle1">
                  <strong>{{ profileData.name }}</strong>
                  <span class="text-grey-7">
                    @{{ profileData.username }}
                    <br class="lt-md">&bull; {{ qweet.date | relativeDate }}
                  </span>
                </q-item-label>
                <q-item-label class="qweet-content text-body1">{{ qweet.content }}</q-item-label>
                
                <!-- Display Photo if exists -->
                <div v-if="qweet.photoUrl" class="q-mt-md">
                  <q-img
                    :src="qweet.photoUrl"
                    class="qweet-photo"
                    :ratio="16/9"
                    @click="showPhotoDialog(qweet.photoUrl)"
                    style="cursor: pointer; border-radius: 16px; max-width: 500px;"
                  />
                </div>

                <div class="qweet-icons row justify-between q-mt-sm">
                  <q-btn
                    color="grey"
                    icon="far fa-comment"
                    size="sm"
                    flat
                    round
                  />
                  <q-btn
                    color="grey"
                    icon="fas fa-retweet"
                    size="sm"
                    flat
                    round
                  />
                  <q-btn
                    @click="toggleLiked(qweet)"
                    :color="qweet.liked ? 'pink' : 'grey'"
                    :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                    size="sm"
                    flat
                    round
                  />
                  <q-btn
                    v-if="isOwnProfile"
                    @click="deleteQweet(qweet)"
                    color="grey"
                    icon="fas fa-trash"
                    size="sm"
                    flat
                    round
                  />
                </div>
              </q-item-section>
            </q-item>
          </transition-group>
        </q-list>
      </div>

      <!-- Empty State -->
      <div v-else class="q-pa-xl text-center">
        <q-icon name="fas fa-dove" size="80px" color="grey-5" />
        <div class="text-h6 text-grey-7 q-mt-md">No qweets yet</div>
        <div class="text-body2 text-grey-6">
          {{ isOwnProfile ? "Start qweeting to see your posts here!" : "This user hasn't posted any qweets yet." }}
        </div>
      </div>
    </q-scroll-area>

    <!-- Photo Dialog for full-size view -->
    <q-dialog v-model="photoDialog">
      <q-card>
        <q-img :src="selectedPhoto" />
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import db, { storage } from 'src/boot/firebase'
import { formatDistance } from 'date-fns'

export default {
  name: 'PageProfile',
  data() {
    return {
      profileData: {
        username: '',
        name: '',
        avatar: '',
        bio: ''
      },
      userQweets: [],
      photoDialog: false,
      selectedPhoto: null,
      currentUser: 'danny__connell' // This would come from authentication in a real app
    }
  },
  computed: {
    totalLikes() {
      return this.userQweets.filter(qweet => qweet.liked).length
    },
    isOwnProfile() {
      return this.profileData.username === this.currentUser
    }
  },
  methods: {
    loadProfile() {
      const username = this.$route.params.username
      
      // In a real app, this would fetch from a users collection
      // For now, we'll use hardcoded profile data
      const profiles = {
        'danny__connell': {
          username: 'danny__connell',
          name: 'Danny Connell',
          avatar: 'https://s.gravatar.com/avatar/ce7f3697e231df38b3ca6065848520da?s=80',
          bio: 'Full-stack developer | Vue.js enthusiast | Building Qwitter 🐦'
        }
      }
      
      this.profileData = profiles[username] || {
        username: username,
        name: username,
        avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        bio: 'Qwitter user'
      }
      
      this.loadUserQweets(username)
    },
    loadUserQweets(username) {
      // Load qweets for this user
      db.collection('qweets')
        .where('username', '==', username)
        .orderBy('date', 'desc')
        .onSnapshot(snapshot => {
          this.userQweets = []
          snapshot.forEach(doc => {
            let qweet = doc.data()
            qweet.id = doc.id
            this.userQweets.push(qweet)
          })
        })
    },
    async deleteQweet(qweet) {
      try {
        // Delete photo from storage if exists
        if (qweet.photoUrl) {
          try {
            const photoRef = storage.refFromURL(qweet.photoUrl)
            await photoRef.delete()
          } catch (error) {
            console.error('Error deleting photo: ', error)
          }
        }
        
        // Delete qweet from Firestore
        await db.collection('qweets').doc(qweet.id).delete()
        
        this.$q.notify({
          message: 'Qweet deleted successfully!',
          color: 'positive',
          icon: 'check_circle'
        })
      } catch (error) {
        console.error('Error removing qweet: ', error)
        this.$q.notify({
          message: 'Error deleting qweet. Please try again.',
          color: 'negative',
          icon: 'error'
        })
      }
    },
    toggleLiked(qweet) {
      db.collection('qweets').doc(qweet.id).update({
        liked: !qweet.liked
      })
      .then(function() {
        console.log('Document successfully updated!')
      })
      .catch(function(error) {
        console.error('Error updating document: ', error)
      })
    },
    showPhotoDialog(photoUrl) {
      this.selectedPhoto = photoUrl
      this.photoDialog = true
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  mounted() {
    this.loadProfile()
  },
  watch: {
    '$route.params.username': function() {
      this.loadProfile()
    }
  }
}
</script>

<style lang="sass" scoped>
.profile-header
  border-bottom: 1px solid rgba(0, 0, 0, 0.12)
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.qweet-content
  white-space: pre-line
.qweet-icons
  margin-left: -5px
.qweet-photo
  border-radius: 16px
  overflow: hidden
  transition: opacity 0.2s
  &:hover
    opacity: 0.9
</style>
