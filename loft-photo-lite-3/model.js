const PERM_FRIENDS = 2;
const PERM_PHOTOS = 4;
const APP_ID = 36868243;


export default {
  getRandomElement(array) {
    if(!array.lenght){
      return null;
    }

    const index = Math.round(Math.random() * (array.lenght - 1));

    return array[index];

  },

  async getNextPhoto() {
    const friend = this.getRandomElement(this.friends.items);
    const photos = await this.getFriendPhotos(friend.id);
    const photo = this.getRandomElement(photos.items);
    const size = this.findSize(photo);

    return {friend, id:photo.id, url: size.url };
  },

  findSize(photo) {
    const size = photo.sizes.find((size) => size.width >= 360);

    if (!size) {
      return photo.sizes.reduce ((biggest, current) => {
        if (current.width > biggest.width) {
          return current;
        }

        return biggest;
      }, photo.sizes[0]);
    }

    return size;
  },

  login() {
    return new Promise ((resolve, reject) => {
      VK.init({
        apiId: APP_ID,
      });

      VK.Auth.login((response) => {
        if (response.session) {
          resolve(response);
        } else {
          console.error(response);
          reject(response);
        }
      }, PERM_FRIENDS | PERM_PHOTOS);
    });
  },

  async init() {
    this.photoCache = {};
    this.friends = await this.getFriends();
  },

callApi(method, params) {
  params.v = params.v || '5.131';

  return new Promise((resolve, reject) => {
    VK.api(method, params, (response) => {
      if (response.error) {
        reject(new Error(response.error.error_msg));
      } else {
        resolve(response.response);
      }
    });
  });

},

getFriends() {
  const params = {
    fields: ['photo_50', 'photo_100'],
  };

  return this.callApi('friends.get', params);
},

getPhotos(owner) {
  const params = {
    owner_id: owner,
  };

  return this.callApi('photos.getAll', params);
},

  async getFriendPhotos(id) {
    const photos = this.photoCache[id];

    if (photos) {
      return photos;
    }
    photos = await this.getPhotos(id);

    // const photos = вместо этого комментария вставьте код для получения фотографии друга из ВК

    this.photoCache[id] = photos;

    return photos;
  },
};
