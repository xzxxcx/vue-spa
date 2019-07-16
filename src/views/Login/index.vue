<template>
<div class="login">
    <div class="login-box">
        <div class="avatar_box">
            <img src="../../assets/logo.png" alt="">
        </div>
    </div>
</div>
</template>
<style lang="less" scoped>
.login{
    height: 100%;
    background: #2b4b6b;
}
.login-box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
</style>
<script>
export default {

}
</script>
