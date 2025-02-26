<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-logo">
        <img src="@/assets/images/logo.png" alt="Logo" />
      </div>
      <div class="footer-links">
        <div class="footer-link-group">
          <h4>关于我们</h4>
          <ul>
            <li><a href="#">公司简介</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>
        <div class="footer-link-group">
          <h4>帮助中心</h4>
          <ul>
            <li><a href="#">常见问题</a></li>
            <li><a href="#">使用指南</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© {{ new Date().getFullYear() }} 版权所有</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: #f5f5f5;
  padding: 30px 0 15px;
}
.footer-content {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}
.footer-logo img {
  height: 40px;
}
.footer-links {
  display: flex;
}
.footer-link-group {
  margin-left: 50px;
}
.footer-link-group h4 {
  font-size: 16px;
  margin-bottom: 15px;
}
.footer-link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-link-group li {
  margin-bottom: 8px;
}
.footer-link-group a {
  color: #666;
  text-decoration: none;
}
.footer-link-group a:hover {
  color: #487FFF;
}
.footer-bottom {
  text-align: center;
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
}
.footer-bottom p {
  margin: 0;
  color: #999;
  font-size: 14px;
}
</style>
