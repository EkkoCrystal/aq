const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  organizationName: state => state.user.organizationName,
  departmentCode: state => state.user.departmentCode,
  departmentName: state => state.user.departmentName,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
