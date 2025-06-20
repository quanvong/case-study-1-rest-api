// Middleware kiểm tra vai trò của user (admin/instructor/user)
module.exports = function authorize(allowedRoles) {
    return (req, res, next) => {
        // req.user được gán từ middleware xác thực JWT (authenToken)
        const userRole = req.user?.role;

        // Kiểm tra user đã đăng nhập và có role chưa
        if (!userRole) {
            return res.status(401).json({ message: 'Chưa xác thực hoặc thiếu thông tin vai trò' });
        }

        // Kiểm tra user có nằm trong danh sách allowedRoles chưa
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này' });
        }
        next();
    };
};