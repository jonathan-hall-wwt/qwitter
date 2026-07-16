<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-pa-md">
        <div class="text-h4 q-mb-md">
          <q-icon name="fas fa-hashtag" color="primary" />
          {{ hashtag }}
        </div>
        <div v-if="qweets.length === 0" class="text-center text-grey-7 q-mt-xl">
          <q-icon name="fas fa-search" size="xl" />
          <div class="text-h6 q-mt-md">No qweets found with this hashtag</div>
        </div>
      </div>

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
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
              <q-item-label class="qweet-content text-body1" v-html="formatContent(qweet.content)"></q-item-label>
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
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { formatDistance } from 'date-fns'

export default {
  name: 'PageHashtag',
  data() {
    return {
      qweets: [],
      unsubscribe: null
    }
  },
  computed: {
    hashtag() {
      return this.$route.params.hashtag
    }
  },
  methods: {
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
    formatContent(content) {
      // Convert hashtags to links
      return content.replace(/#(\w+)/g, (match, tag) => {
        return `<a href="#/hashtag/${tag}" class="hashtag-link">#${tag}</a>`
      })
    },
    loadQweets() {
      // Clean up previous listener if it exists
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      
      // Reset qweets
      this.qweets = []
      
      // Query qweets that contain this hashtag
      this.unsubscribe = db.collection('qweets')
        .where('hashtags', 'array-contains', this.hashtag.toLowerCase())
        .orderBy('date', 'desc')
        .onSnapshot(snapshot => {
          this.qweets = []
          snapshot.forEach(doc => {
            let qweet = doc.data()
            qweet.id = doc.id
            this.qweets.push(qweet)
          })
        })
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  mounted() {
    this.loadQweets()
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  watch: {
    '$route.params.hashtag'() {
      this.loadQweets()
    }
  }
}
</script>

<style lang="sass" scoped>
.qweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.qweet-content
  white-space: pre-line
  ::v-deep .hashtag-link
    color: $primary
    text-decoration: none
    font-weight: 500
    &:hover
      text-decoration: underline
.qweet-icons
  margin-left: -5px
</style>
