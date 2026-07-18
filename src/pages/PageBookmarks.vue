<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <!-- Header Section -->
      <div class="q-pa-md">
        <div class="text-h5 text-weight-bold q-mb-sm">
          <q-icon name="bookmark" color="primary" size="sm" class="q-mr-sm" />
          Bookmarks
        </div>
        <div class="text-grey-7">
          {{ bookmarkedQweets.length }} saved qweet{{ bookmarkedQweets.length !== 1 ? 's' : '' }}
        </div>
      </div>

      <q-separator color="grey-2" size="10px" />

      <!-- Empty State -->
      <div v-if="bookmarkedQweets.length === 0" class="q-pa-xl text-center">
        <q-icon name="bookmark_border" size="80px" color="grey-5" class="q-mb-md" />
        <div class="text-h6 text-grey-7 q-mb-sm">No bookmarks yet</div>
        <div class="text-body2 text-grey-6">
          Save qweets to read later by tapping the bookmark icon
        </div>
      </div>

      <!-- Bookmarked Qweets List -->
      <q-list v-else separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-item
            v-for="qweet in bookmarkedQweets"
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
                  @click="removeBookmark(qweet.id)"
                  color="primary"
                  icon="bookmark"
                  size="sm"
                  flat
                  round
                >
                  <q-tooltip>Remove bookmark</q-tooltip>
                </q-btn>
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
import db from 'src/boot/firebase'
import { formatDistance } from 'date-fns'

export default {
  name: 'PageBookmarks',
  data() {
    return {
      bookmarkedQweets: [],
      photoDialog: false,
      selectedPhoto: null,
      currentUser: 'danny__connell' // Hardcoded for now, will be replaced with real auth
    }
  },
  methods: {
    async removeBookmark(qweetId) {
      try {
        // Remove from bookmarks collection
        const bookmarkQuery = await db.collection('bookmarks')
          .where('userId', '==', this.currentUser)
          .where('qweetId', '==', qweetId)
          .get()
        
        bookmarkQuery.forEach(async (doc) => {
          await doc.ref.delete()
        })

        this.$q.notify({
          message: 'Bookmark removed',
          color: 'positive',
          icon: 'bookmark_remove',
          position: 'top'
        })
      } catch (error) {
        console.error('Error removing bookmark: ', error)
        this.$q.notify({
          message: 'Error removing bookmark',
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
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  mounted() {
    // Listen to bookmarks for current user
    db.collection('bookmarks')
      .where('userId', '==', this.currentUser)
      .orderBy('bookmarkedAt', 'desc')
      .onSnapshot(async (snapshot) => {
        // Get all bookmark changes
        const bookmarkChanges = []
        snapshot.docChanges().forEach(change => {
          bookmarkChanges.push({
            type: change.type,
            qweetId: change.doc.data().qweetId,
            bookmarkId: change.doc.id
          })
        })

        // Process each change
        for (const change of bookmarkChanges) {
          if (change.type === 'added') {
            // Fetch the qweet data
            const qweetDoc = await db.collection('qweets').doc(change.qweetId).get()
            if (qweetDoc.exists) {
              const qweetData = qweetDoc.data()
              qweetData.id = qweetDoc.id
              this.bookmarkedQweets.unshift(qweetData)
            }
          }
          if (change.type === 'removed') {
            // Remove from local array
            const index = this.bookmarkedQweets.findIndex(q => q.id === change.qweetId)
            if (index !== -1) {
              this.bookmarkedQweets.splice(index, 1)
            }
          }
        }

        // Also listen to qweet updates (likes, etc.)
        this.bookmarkedQweets.forEach(qweet => {
          db.collection('qweets').doc(qweet.id).onSnapshot(doc => {
            if (doc.exists) {
              const index = this.bookmarkedQweets.findIndex(q => q.id === doc.id)
              if (index !== -1) {
                Object.assign(this.bookmarkedQweets[index], doc.data())
              }
            }
          })
        })
      })
  }
}
</script>

<style lang="sass" scoped>
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
