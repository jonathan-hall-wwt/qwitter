<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <!-- Qashtag Header -->
      <div class="qashtag-header q-pa-lg bg-primary text-white">
        <div class="text-h4 text-weight-bold">{{ qashtagDisplay }}</div>
        <div class="text-subtitle1 q-mt-sm">
          {{ qweetCount }} {{ qweetCount === 1 ? 'Qweet' : 'Qweets' }}
        </div>
      </div>

      <q-separator
        class="divider"
        color="grey-2"
        size="10px"
      />

      <!-- Loading State -->
      <div v-if="loading" class="q-pa-lg text-center">
        <q-spinner color="primary" size="50px" />
        <div class="q-mt-md text-grey-7">Loading qweets...</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="qweets.length === 0" class="q-pa-xl text-center">
        <q-icon name="search_off" size="80px" color="grey-5" />
        <div class="text-h6 q-mt-md text-grey-7">No qweets found</div>
        <div class="text-body2 text-grey-6 q-mt-sm">
          Be the first to qweet with {{ qashtagDisplay }}!
        </div>
        <q-btn
          to="/"
          color="primary"
          label="Go to Home"
          rounded
          unelevated
          class="q-mt-lg"
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
            v-for="qweet in qweets"
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
              <q-item-label class="qweet-content text-body1">
                <span v-html="formatQweetContent(qweet.content)"></span>
              </q-item-label>
              
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
  name: 'PageQashtag',
  data() {
    return {
      qashtag: '',
      qweets: [],
      loading: true,
      photoDialog: false,
      selectedPhoto: null,
      unsubscribe: null
    }
  },
  computed: {
    qashtagDisplay() {
      return `#${this.qashtag}`
    },
    qweetCount() {
      return this.qweets.length
    }
  },
  methods: {
    formatQweetContent(content) {
      // Replace hashtags with clickable links
      const qashtagRegex = /#([\w]+)/g
      return content.replace(qashtagRegex, (match, tag) => {
        return `<a href="#/qashtag/${tag.toLowerCase()}" class="qashtag-link">#${tag}</a>`
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
    },
    loadQweets() {
      this.loading = true
      this.qweets = []
      
      // Unsubscribe from previous listener if exists
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      
      // Query qweets that contain this qashtag
      this.unsubscribe = db.collection('qweets')
        .where('qashtags', 'array-contains', `#${this.qashtag}`)
        .orderBy('date', 'desc')
        .onSnapshot(snapshot => {
          this.qweets = []
          snapshot.forEach(doc => {
            let qweet = doc.data()
            qweet.id = doc.id
            this.qweets.push(qweet)
          })
          this.loading = false
        }, error => {
          console.error('Error loading qweets: ', error)
          this.loading = false
          this.$q.notify({
            message: 'Error loading qweets. Please try again.',
            color: 'negative',
            icon: 'error'
          })
        })
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  watch: {
    '$route.params.qashtag': {
      immediate: true,
      handler(newQashtag) {
        if (newQashtag) {
          this.qashtag = newQashtag.toLowerCase()
          this.loadQweets()
        }
      }
    }
  },
  beforeDestroy() {
    // Unsubscribe from Firestore listener
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
</script>

<style lang="sass" scoped>
.qashtag-header
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
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

<style lang="sass">
.qashtag-link
  color: #1976d2
  text-decoration: none
  font-weight: 500
  &:hover
    text-decoration: underline
</style>
