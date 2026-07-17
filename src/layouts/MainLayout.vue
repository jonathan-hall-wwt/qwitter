<template>
  <q-layout view="lHr lpR fFf">

    <q-header bordered class="bg-white text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title class="text-weight-bold">
          <span class="gt-sm">{{ $route.name }}</span>
          <q-icon
            class="header-icon q-pa-md lt-md"
            name="fas fa-dove"
            size="sm"
            color="primary"
          />
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="left"
      side="left"
      :width="283"
      bordered
      show-if-above
    >
      <q-icon
        class="q-pa-md"
        name="fas fa-dove"
        size="lg"
        color="primary"
      />

      <q-list>
        <q-item
          to="/"
          v-ripple
          clickable
          exact
        >
          <q-item-section avatar>
            <q-icon name="home" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">Home</q-item-section>
        </q-item>
        <q-item
          to="/about"
          v-ripple
          clickable
          exact
        >
          <q-item-section avatar>
            <q-icon name="help" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">About</q-item-section>
        </q-item>
      </q-list>

    </q-drawer>

    <q-drawer show-if-above v-model="right" side="right" bordered>
      <q-input
        placeholder="Search Qwitter"
        class="q-ma-md"
        outlined
        rounded
        dense
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- Trending Topics Section -->
      <q-card class="q-ma-md trending-card" flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6 text-weight-bold">
            <q-icon name="trending_up" color="primary" class="q-mr-sm" />
            Trending Topics
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none">
          <q-list separator>
            <q-item
              v-for="(topic, index) in trendingTopics"
              :key="topic.hashtag"
              clickable
              v-ripple
              @click="navigateToHashtag(topic.hashtag)"
              class="trending-item"
            >
              <q-item-section avatar>
                <q-avatar 
                  :color="getTrendingColor(index)" 
                  text-color="white"
                  size="md"
                >
                  {{ index + 1 }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold hashtag-label">
                  #{{ topic.hashtag }}
                </q-item-label>
                <q-item-label caption>
                  {{ topic.count }} {{ topic.count === 1 ? 'Qweet' : 'Qweets' }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon 
                  name="trending_up" 
                  :color="getTrendingColor(index)" 
                  size="sm"
                />
              </q-item-section>
            </q-item>

            <q-item v-if="trendingTopics.length === 0" class="text-center">
              <q-item-section>
                <q-item-label class="text-grey-6">
                  <q-icon name="info" size="sm" class="q-mr-xs" />
                  No trending topics yet
                </q-item-label>
                <q-item-label caption class="q-mt-sm">
                  Start using hashtags in your qweets!
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Quick Stats Card -->
      <q-card class="q-ma-md stats-card" flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6 text-weight-bold">
            <q-icon name="bar_chart" color="primary" class="q-mr-sm" />
            Quick Stats
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-6 text-center">
              <div class="text-h5 text-weight-bold text-primary">
                {{ totalQweets }}
              </div>
              <div class="text-caption text-grey-7">Total Qweets</div>
            </div>
            <div class="col-6 text-center">
              <div class="text-h5 text-weight-bold text-pink">
                {{ totalHashtags }}
              </div>
              <div class="text-caption text-grey-7">Unique Hashtags</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

    </q-drawer>

    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>

  </q-layout>
</template>

<script>
import db from 'src/boot/firebase'

export default {
  data () {
    return {
      left: false,
      right: false,
      qweets: [],
      hashtagCounts: {}
    }
  },
  computed: {
    trendingTopics() {
      // Convert hashtagCounts object to array and sort by count
      const topics = Object.entries(this.hashtagCounts)
        .map(([hashtag, count]) => ({ hashtag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Top 10 trending topics
      
      return topics
    },
    totalQweets() {
      return this.qweets.length
    },
    totalHashtags() {
      return Object.keys(this.hashtagCounts).length
    }
  },
  methods: {
    getTrendingColor(index) {
      const colors = ['primary', 'secondary', 'accent', 'positive', 'info']
      return colors[index % colors.length]
    },
    navigateToHashtag(hashtag) {
      // Navigate to home and trigger filter
      this.$router.push('/').then(() => {
        // Use a small delay to ensure the page is loaded
        setTimeout(() => {
          if (window.filterByHashtag) {
            window.filterByHashtag(hashtag)
          }
        }, 100)
      })
    },
    calculateHashtagCounts() {
      const counts = {}
      
      this.qweets.forEach(qweet => {
        if (qweet.hashtags && Array.isArray(qweet.hashtags)) {
          qweet.hashtags.forEach(hashtag => {
            const tag = hashtag.replace('#', '').toLowerCase()
            counts[tag] = (counts[tag] || 0) + 1
          })
        }
      })
      
      this.hashtagCounts = counts
    }
  },
  mounted() {
    // Listen to all qweets for trending topics calculation
    db.collection('qweets').onSnapshot(snapshot => {
      this.qweets = []
      snapshot.forEach(doc => {
        const qweet = doc.data()
        qweet.id = doc.id
        this.qweets.push(qweet)
      })
      
      // Recalculate hashtag counts whenever qweets change
      this.calculateHashtagCounts()
    })
  }
}
</script>

<style lang="sass">
.header-icon
  position: absolute
  bottom: 0
  left: 50%
  transform: translateX(-50%)

.trending-card
  border-radius: 16px
  overflow: hidden

.stats-card
  border-radius: 16px
  overflow: hidden

.trending-item
  transition: background-color 0.2s
  &:hover
    background-color: rgba(0, 0, 0, 0.03)

.hashtag-label
  color: #1976d2
  font-size: 15px
</style>
