<template>
  <!-- change user role content -->
  <!--  -->
  <div class="change_user_role" v-show="isOpne">
    <div class="content">
      <div class="role">
        <img
          :src="
            this.$global_getImgUrl(
              role.userSelectIcon === null
                ? role.userDefault
                : role.userSelectIcon,
              'player_icon'
            )
          "
          alt=""
        />
      </div>
      <hr />
      <div class="roles_container">
        <div class="roles flex flex-wrap">
          <div
            v-for="i in $store.state.iconData.playerIcon"
            :key="i"
            class="img_content"
            :class="{ focus: role.userSelectIcon === i }"
          >
            <div class="icon_box" @click="role.userSelectIcon = i">
              <img :src="this.$global_getImgUrl(i, 'player_icon')" alt="" />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="btn">
        <answerBtn :state="true" @click="setUserRole()">agree</answerBtn>
        <answerBtn :state="false" @click="close()">cancel</answerBtn>
      </div>
    </div>
  </div>
</template>

<script>
import { socket } from '@/../assets/socket';
import answerBtn from './answerBtn.vue';
export default {
  components: { answerBtn },
  data() {
    return {
      socket,
      selfPlayer: null,
      userRoom: null,
      role: {
        open: false,
        userSelectIcon: null,
        userDefault: null,
      },
    };
  },
  props: ['isOpne'],
  methods: {
    close() {
      this.$emit('close', false);
    },
    setUserRole() {
      this.$store.commit('updateUserIcon', this.role.userSelectIcon);
      this.role.open = false;
      this.socket.emit('id_check', {
        id: this.selfPlayer,
        room: this.userRoom,
        icon: this.$store.state.userStore.icon,
      });

      this.$emit('userIcon', this.role.userSelectIcon);
      this.close();
    },
  },
  created() {
    const localStorageData = JSON.parse(localStorage.getItem('userData'));
    this.selfPlayer = localStorageData.userName;
    this.userRoom = localStorageData.userRoom;
    this.userIcon = localStorageData.icon;
    this.role.userDefault = this.userIcon;
    this.role.userSelectIcon = this.userIcon;
  },
};
</script>

<style scoped>
@import '@/scss/changeUserRole.scss';
</style>
