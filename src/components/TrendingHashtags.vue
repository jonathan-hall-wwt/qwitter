<template>
  <div>
    <div class="text-h6 text-weight-bold q-pa-md">
      Trending Hashtags
    </div>
    <q-list separator padding>
      <q-item
        v-for="(item, index) in trendingHashtags"
        :key="index"
        :to="\`/hashtag/${item.tag}\`"
        clickable
        v-ripple
        class="q-pa-md"
      >
        <q-item-section>
          <q-item-label class="text-weight-bold">
            <q-icon name="fas fa-hashtag" color="primary" size="sm" />
            {{ item.tag }}
          </q-item-label>
          <q-item-label caption>{{ item.count }} {{ item.count === 1 ? 'Qweet' : 'Qweets' }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="trending_up" color="positive" />
        </q-item-section>
      </q-item>
      <q-item v-if="trendingHashtags.length === 0" class="q-pa-md">
        <q-item-section>
          <q-item-label class="text-grey-7 text-center">
            No trending hashtags yet
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import db from 'src/boot/firebase'

export default {
  name: 'TrendingHashtags',
  data() {
    return {
      trendingHashtags: [],
      unsubscribe: null
    }
  },
  methods: {
    loadTrendingHashtags() {
      // Listen to all qweets and calculate trending hashtags
      this.unsubscribe = db.collection('qweets')
        .orderBy('date', 'desc')
        .limit(100) // Look at recent qweets only
        .onSnapshot(snapshot => {
          const hashtagCounts = {}
          
          snapshot.forEach(doc => {
            const qweet = doc.data()
            if (qweet.hashtags && Array.isArray(qweet.hashtags)) {
              qweet.hashtags.forEach(tag => {
                hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1
              })
            }
          })
          
          // Convert to array and sort by count
          this.trendingHashtags = Object.entries(hashtagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5) // Show top 5
        })
    }
  },
  mounted() {
    this.loadTrendingHashtags()
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
