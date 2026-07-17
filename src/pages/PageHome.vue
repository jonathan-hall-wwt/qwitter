<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            v-model="newQweetContent"
            class="new-qweet"
            placeholder="What's happening?"
            maxlength="280"
            bottom-slots
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://s.gravatar.com/avatar/ce7f3697e231df38b3ca6065848520da?s=80">
              </q-avatar>
            </template>
            <template v-slot:hint>
              <div :class="characterCounterClass">{{ characterCountText }}</div>
            </template>
          </q-input>
          
          <!-- Photo Preview -->
          <div v-if="newQweetPhoto" class="q-mt-md photo-preview-container">
            <q-img
              :src="newQweetPhotoPreview"
              class="photo-preview"
              :ratio="16/9"
            >
              <div class="absolute-top-right q-pa-xs">
                <q-btn
                  @click="removePhoto"
                  icon="close"
                  color="grey-8"
                  size="sm"
                  round
                  dense
                />
              </div>
            </q-img>
          </div>

          <!-- Photo Upload Button -->
          <div class="q-mt-sm">
            <q-btn
              @click="$refs.photoInput.click()"
              icon="far fa-image"
              color="primary"
              size="sm"
              flat
              round
              :disable="!!newQweetPhoto"
            >
              <q-tooltip>Add photo</q-tooltip>
            </q-btn>
            <input
              ref="photoInput"
              type="file"
              accept="image/*"
              @change="handlePhotoUpload"
              style="display: none"
            />
          </div>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewQweet"
            :disable="!newQweetContent || isUploading"
            :loading="isUploading"
            class="q-mb-lg"
            color="primary"
            label="Qweet"
            rounded
            unelevated
            no-caps
          />
        </div>
      </div>

      <q-separator
        class="divider"
        color="grey-2"
        size="10px"
      />

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
  name: 'PageHome',
  data() {
    return {
      currentUser: 'danny__connell', // Hardcoded for now, will be replaced with auth
      newQweetContent: '',
      newQweetPhoto: null,
      newQweetPhotoPreview: null,
      isUploading: false,
      maxCharacters: 280,
      photoDialog: false,
      selectedPhoto: null,
      qweets: []
    }
  },
  computed: {
    characterCount() {
      return this.newQweetContent.length
    },
    charactersRemaining() {
      return this.maxCharacters - this.characterCount
    },
    characterCountText() {
      return `${this.characterCount} / ${this.maxCharacters}`
    },
    characterCounterClass() {
      if (this.charactersRemaining < 0) {
        return 'text-negative text-weight-bold'
      } else if (this.charactersRemaining <= 20) {
        return 'text-warning text-weight-bold'
      } else {
        return 'text-grey-7'
      }
    }
  },
  methods: {
    handlePhotoUpload(event) {
      const file = event.target.files[0]
      if (file && file.type.startsWith('image/')) {
        this.newQweetPhoto = file
        // Create preview URL
        this.newQweetPhotoPreview = URL.createObjectURL(file)
      } else {
        this.$q.notify({
          message: 'Please select a valid image file',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    removePhoto() {
      if (this.newQweetPhotoPreview) {
        URL.revokeObjectURL(this.newQweetPhotoPreview)
      }
      this.newQweetPhoto = null
      this.newQweetPhotoPreview = null
      this.$refs.photoInput.value = ''
    },
    async addNewQweet() {
      this.isUploading = true
      
      try {
        let photoUrl = null
        
        // Upload photo if one is selected
        if (this.newQweetPhoto) {
          const timestamp = Date.now()
          const fileName = `qweet-photos/${timestamp}_${this.newQweetPhoto.name}`
          const storageRef = storage.ref(fileName)
          
          // Upload file
          const snapshot = await storageRef.put(this.newQweetPhoto)
          
          // Get download URL
          photoUrl = await snapshot.ref.getDownloadURL()
        }
        
        // Create qweet object
        let newQweet = {
          content: this.newQweetContent,
          date: Date.now(),
          liked: false,
          username: this.currentUser // Add username field
        }
        
        // Add photo URL if exists
        if (photoUrl) {
          newQweet.photoUrl = photoUrl
        }
        
        // Save to Firestore
        await db.collection('qweets').add(newQweet)
        
        // Reset form
        this.newQweetContent = ''
        this.removePhoto()
        
        this.$q.notify({
          message: 'Qweet posted successfully!',
          color: 'positive',
          icon: 'check_circle'
        })
      } catch (error) {
        console.error('Error adding qweet: ', error)
        this.$q.notify({
          message: 'Error posting qweet. Please try again.',
          color: 'negative',
          icon: 'error'
        })
      } finally {
        this.isUploading = false
      }
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
    db.collection('qweets').orderBy('date').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let qweetChange = change.doc.data()
        qweetChange.id = change.doc.id
        if (change.type === 'added') {
          console.log('New qweet: ', qweetChange)
          this.qweets.unshift(qweetChange)
        }
        if (change.type === 'modified') {
          console.log('Modified qweet: ', qweetChange)
          let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
          Object.assign(this.qweets[index], qweetChange)
        }
        if (change.type === 'removed') {
          console.log('Removed qweet: ', qweetChange)
          let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
          this.qweets.splice(index, 1)
        }
      })
    })
  },
  beforeDestroy() {
    // Clean up preview URL if component is destroyed
    if (this.newQweetPhotoPreview) {
      URL.revokeObjectURL(this.newQweetPhotoPreview)
    }
  }
}
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important
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
.photo-preview-container
  position: relative
  max-width: 500px
.photo-preview
  border-radius: 16px
  overflow: hidden
.qweet-photo
  border-radius: 16px
  overflow: hidden
  transition: opacity 0.2s
  &:hover
    opacity: 0.9
</style>
