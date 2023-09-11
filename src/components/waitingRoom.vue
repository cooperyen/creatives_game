<template>
  <div>
    <h1>Waiting room</h1>
    {{}}
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ['socket', 'state'],
  methods: {},
  mounted() {
    const userName = this.$store.state.userStore.userName;
    this.socket.emit('updatepage', { message: 'wait', ownid: userName });

    this.socket.on('re_updatepage', function (url) {
      console.log(url);
    });
  },
};
</script>
