<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <!-- Profile Header -->
      <div class="profile-header bg-primary q-pa-md">
        <div class="row items-center q-gutter-md">
          <q-avatar size="120px" class="profile-avatar">
            <img src="https://s.gravatar.com/avatar/ce7f3697e231df38b3ca6065848520da?s=120">
          </q-avatar>
          <div class="text-white">
            <div class="text-h4 text-weight-bold">Danny Connell</div>
            <div class="text-h6">@danny__connell</div>
            <div class="q-mt-sm">
              <q-icon name="calendar_today" size="sm" />
              Joined {{ joinDate }}
            </div>
          </div>
        </div>
        
        <!-- Profile Bio -->
        <div class="q-mt-md text-white">
          <p class="text-body1">
            {{ bio }}
          </p>
        </div>

        <!-- Edit Profile Button -->
        <div class="q-mt-md">
          <q-btn
            @click="editProfileDialog = true"
            label="Edit Profile"
            color="white"
            text-color="primary"
            rounded
            unelevated
            no-caps
          />
        </div>
      </div>

      <!-- Profile Stats -->
      <div class="row q-pa-md bg-grey-2">
        <div class="col text-center">
          <div class="text-h5 text-weight-bold">{{ userQweets.length }}</div>
          <div class="text-grey-7">Qweets</div>
        </div>
        <div class="col text-center">
          <div class="text-h5 text-weight-bold">{{ totalLikes }}</div>
          <div class="text-grey-7">Likes Received</div>
        </div>
        <div class="col text-center">
          <div class="text-h5 text-weight-bold">{{ qweetsWithPhotos }}</div>
          <div class="text-grey-7">Photos</div>
        </div>
      </div>

      <q-separator
        class="divider"
        color="grey-2"
        size="10px"
      />

      <!-- User's Qweets -->
      <div class="q-pa-md">
        <div class="text-h6 text-weight-bold q-mb-md">My Qweets</div>
        
        <q-list separator v-if="userQweets.length > 0">
          <transition-group
            appear
            enter-active-class="animated fadeIn slow"
            leave-active-class="animated fadeOut slow"
          >
            <q-item
              v-for="qweet in userQweets"
              :key="qweet.id"
              class="qweet q-py-md"
            >
              <q-item-section avatar top>
                <q-avatar size="xl">
                  <img src="https://s.gravatar.com/avatar/ce7f3697e231df38b3ca6065848520da?s=80">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle1">
                  <strong>Danny Connell</strong>
                  <span class="text-grey-7">
                    @danny__connell 
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

        <!-- Empty State -->
        <div v-else class="text-center q-pa-xl">
          <q-icon name="chat_bubble_outline" size="64px" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">No qweets yet</div>
          <div class="text-body2 text-grey-6">Start sharing your thoughts!</div>
          <q-btn
            to="/"
            label="Create a Qweet"
            color="primary"
            rounded
            unelevated
            no-caps
            class="q-mt-md"
          />
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

    <!-- Edit Profile Dialog -->
    <q-dialog v-model="editProfileDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Profile</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="editBio"
            label="Bio"
            type="textarea"
            rows="4"
            maxlength="160"
            counter
            outlined
            hint="Tell us about yourself"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            @click="saveProfile"
            label="Save"
            color="primary"
            unelevated
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import db, { storage } from 'src/boot/firebase'
import { formatDistance, format } from 'date-fns'

export default {
  name: 'PageProfile',
  data() {
    return {
      bio: 'Full-stack developer passionate about Vue.js, Firebase, and building amazing apps! 🚀',
      editBio: '',
      joinDate: 'January 2024',
      userQweets: [],
      photoDialog: false,
      selectedPhoto: null,
      editProfileDialog: false
    }
  },
  computed: {
    totalLikes() {
      return this.userQweets.filter(qweet => qweet.liked).length
    },
    qweetsWithPhotos() {
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
    saveProfile() {
      this.bio = this.editBio
      this.editProfileDialog = false
      this.$q.notify({
        message: 'Profile updated successfully!',
        color: 'positive',
        icon: 'check_circle'
      })
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  mounted() {
    // Initialize edit bio with current bio
    this.editBio = this.bio

    // Load user's qweets
    db.collection('qweets').orderBy('date', 'desc').onSnapshot(snapshot => {
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
  position: relative
  min-height: 200px

.profile-avatar
  border: 4px solid white
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

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
