exports.getAdminPage = (req, res) => {
  res.render('admin/index', { layout: '../views/layouts/admin' });
};
