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

      <!-- Trending Qashtags Section -->
      <div class="trending-section q-pa-md">
        <div class="text-h6 text-weight-bold q-mb-md">Trending Qashtags</div>
        
        <!-- Loading State -->
        <div v-if="loadingTrending" class="text-center q-py-md">
          <q-spinner color="primary" size="30px" />
        </div>
        
        <!-- Empty State -->
        <div v-else-if="trendingQashtags.length === 0" class="text-center q-py-md">
          <q-icon name="tag" size="40px" color="grey-5" />
          <div class="text-body2 text-grey-6 q-mt-sm">
            No trending qashtags yet
          </div>
        </div>
        
        <!-- Trending List -->
        <q-list v-else separator padding>
          <q-item
            v-for="(item, index) in trendingQashtags"
            :key="item.qashtag"
            :to="`/qashtag/${item.qashtag.substring(1)}`"
            clickable
            v-ripple
            class="trending-item"
          >
            <q-item-section avatar>
              <div class="trending-rank text-weight-bold text-grey-7">
                {{ index + 1 }}
              </div>
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="text-weight-bold qashtag-text">
                {{ item.qashtag }}
              </q-item-label>
              <q-item-label caption class="text-grey-7">
                {{ item.count }} {{ item.count === 1 ? 'Qweet' : 'Qweets' }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="trending_up" :color="getTrendingColor(index)" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
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
      trendingQashtags: [],
      loadingTrending: true,
      unsubscribe: null
    }
  },
  methods: {
    getTrendingColor(index) {
      if (index === 0) return 'red'
      if (index === 1) return 'orange'
      if (index === 2) return 'amber'
      return 'primary'
    },
    calculateTrending() {
      // Listen to all qweets and calculate trending qashtags
      this.unsubscribe = db.collection('qweets')
        .onSnapshot(snapshot => {
          const qashtagCounts = {}
          
          snapshot.forEach(doc => {
            const qweet = doc.data()
            if (qweet.qashtags && Array.isArray(qweet.qashtags)) {
              qweet.qashtags.forEach(qashtag => {
                if (qashtagCounts[qashtag]) {
                  qashtagCounts[qashtag]++
                } else {
                  qashtagCounts[qashtag] = 1
                }
              })
            }
          })
          
          // Convert to array and sort by count
          this.trendingQashtags = Object.entries(qashtagCounts)
            .map(([qashtag, count]) => ({ qashtag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10) // Top 10 trending
          
          this.loadingTrending = false
        }, error => {
          console.error('Error loading trending qashtags: ', error)
          this.loadingTrending = false
        })
    }
  },
  mounted() {
    this.calculateTrending()
  },
  beforeDestroy() {
    // Unsubscribe from Firestore listener
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
</script>

<style lang="sass">
.header-icon
  position: absolute
  bottom: 0
  left: 50%
  transform: translateX(-50%)

.trending-section
  background: #f7f9fc
  border-radius: 16px
  margin: 0 8px

.trending-item
  border-radius: 8px
  transition: background-color 0.2s
  &:hover
    background-color: rgba(25, 118, 210, 0.05)

.trending-rank
  font-size: 18px
  min-width: 24px
  text-align: center

.qashtag-text
  color: #1976d2
  font-size: 15px
</style>
