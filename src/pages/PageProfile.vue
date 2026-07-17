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
            <div class="text-subtitle1 text-grey-7">@{{ profileData.username }}</div>
            <div class="text-body1 q-mt-sm">{{ profileData.bio }}</div>
            <div class="text-caption text-grey-7 q-mt-xs">
              <q-icon name="event" size="xs" />
              Joined {{ profileData.joinDate }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              @click="showEditBioDialog = true"
              label="Edit Profile"
              color="primary"
              outline
              rounded
              no-caps
            />
          </div>
        </div>

        <!-- Profile Statistics -->
        <div class="row q-mt-lg q-col-gutter-md">
          <div class="col-12 col-sm-4">
            <q-card flat bordered>
              <q-card-section class="text-center">
                <div class="text-h4 text-weight-bold text-primary">{{ totalQweets }}</div>
                <div class="text-subtitle2 text-grey-7">Qweets</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-4">
            <q-card flat bordered>
              <q-card-section class="text-center">
                <div class="text-h4 text-weight-bold text-pink">{{ totalLikes }}</div>
                <div class="text-subtitle2 text-grey-7">Likes Received</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-4">
            <q-card flat bordered>
              <q-card-section class="text-center">
                <div class="text-h4 text-weight-bold text-purple">{{ totalPhotos }}</div>
                <div class="text-subtitle2 text-grey-7">Photos</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <q-separator class="divider" color="grey-2" size="10px" />

      <!-- User's Qweets -->
      <div class="q-pa-md">
        <div class="text-h6 text-weight-bold q-mb-md">Your Qweets</div>
        
        <!-- Empty State -->
        <div v-if="userQweets.length === 0" class="text-center q-pa-xl">
          <q-icon name="fas fa-dove" size="64px" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">No qweets yet</div>
          <div class="text-body2 text-grey-6 q-mt-sm">
            Start sharing your thoughts with the world!
          </div>
          <q-btn
            to="/"
            label="Create Your First Qweet"
            color="primary"
            rounded
            unelevated
            no-caps
            class="q-mt-md"
          />
        </div>

        <!-- Qweets List -->
        <q-list v-else separator>
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
    </q-scroll-area>

    <!-- Edit Bio Dialog -->
    <q-dialog v-model="showEditBioDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Bio</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="editedBio"
            type="textarea"
            label="Bio"
            maxlength="160"
            counter
            autogrow
            outlined
            hint="Tell people a little about yourself"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            @click="saveBio"
            label="Save"
            color="primary"
            unelevated
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
      currentUser: 'danny__connell', // Hardcoded for now, will be replaced with auth
      profileData: {
        name: 'Danny Connell',
        username: 'danny__connell',
        avatar: 'https://s.gravatar.com/avatar/ce7f3697e231df38b3ca6065848520da?s=80',
        bio: 'Web developer passionate about Vue.js and Firebase. Building cool stuff with Quasar Framework! 🚀',
        joinDate: 'January 2024'
      },
      userQweets: [],
      showEditBioDialog: false,
      editedBio: '',
      photoDialog: false,
      selectedPhoto: null
    }
  },
  computed: {
    totalQweets() {
      return this.userQweets.length
    },
    totalLikes() {
      return this.userQweets.filter(qweet => qweet.liked).length
    },
    totalPhotos() {
      return this.userQweets.filter(qweet => qweet.photoUrl).length
    }
  },
  methods: {
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
      .then(() => {
        console.log('Document successfully updated!')
      })
      .catch((error) => {
        console.error('Error updating document: ', error)
      })
    },
    showPhotoDialog(photoUrl) {
      this.selectedPhoto = photoUrl
      this.photoDialog = true
    },
    saveBio() {
      this.profileData.bio = this.editedBio
      this.$q.notify({
        message: 'Bio updated successfully!',
        color: 'positive',
        icon: 'check_circle'
      })
      // In future: save to Firestore users collection
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  mounted() {
    // Initialize edited bio with current bio
    this.editedBio = this.profileData.bio

    // Load user's qweets
    // Note: This will need a composite index in Firestore
    // Firebase will prompt you to create it when you first run this query
    db.collection('qweets')
      .where('username', '==', this.currentUser)
      .orderBy('date', 'desc')
      .onSnapshot(snapshot => {
        this.userQweets = []
        snapshot.forEach(doc => {
          let qweet = doc.data()
          qweet.id = doc.id
          this.userQweets.push(qweet)
        })
      })
  }
}
</script>

<style lang="sass" scoped>
.profile-header
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)

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
