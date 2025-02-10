@php
  $customizerHidden = 'customizer-hide';
@endphp

@extends('layouts/blankLayout')

@section('title', 'Register Basic - Pages')

@section('vendor-style')
  @vite([
    'resources/assets/vendor/libs/@form-validation/form-validation.scss',
      'resources/assets/vendor/libs/toastr/toastr.scss',
  ])
@endsection

@section('page-style')
  @vite([
    'resources/assets/vendor/scss/pages/page-auth.scss'
  ])
@endsection

@section('vendor-script')
  @vite([
    'resources/assets/vendor/libs/toastr/toastr.js',
    'resources/assets/vendor/libs/@form-validation/popular.js',
    'resources/assets/vendor/libs/@form-validation/bootstrap5.js',
    'resources/assets/vendor/libs/@form-validation/auto-focus.js'
  ])
@endsection

@section('page-script')
  @vite([
    'resources/assets/js/pages/register.js'
  ])

  <script>
    const URL_LOGIN = {{ Illuminate\Support\Js::from(route('login')) }};
  </script>
@endsection

@section('content')
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y">
      <div class="authentication-inner py-6">

        <!-- Register Card -->
        <div class="card">
          <div class="card-body">
            <!-- Logo -->
            <div class="app-brand justify-content-center mb-6">
              <a href="{{url('/')}}" class="app-brand-link">
                <span class="app-brand-logo demo">@include('_partials.macros',['height'=>20,'withbg' => "fill: #fff;"])</span>
                <span class="app-brand-text demo text-heading fw-bold">{{ config('variables.templateName') }}</span>
              </a>
            </div>
            <!-- /Logo -->
            <h4 class="mb-1">Bắt đầu phiên làm việc 🚀</h4>
            <p class="mb-6">Giúp việc quản lý ứng dụng của bạn trở nên dễ dàng và thú vị!</p>

            <form id="formRegister" class="mb-6" >

              <div class="mb-6 ">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" name="username" placeholder="Nhập username của bạn" autofocus>
              </div>
              <div class="mb-6">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" id="email" name="email" placeholder="Nhập Email của bạn">
              </div>
              <div class="mb-6 form-password-toggle">
                <label class="form-label" for="password">Password</label>
                <div class="input-group input-group-merge">
                  <input type="password" id="password" class="form-control" name="password" placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" aria-describedby="password" />
                  <span class="input-group-text cursor-pointer"><i class="ti ti-eye-off"></i></span>
                </div>
              </div>
              <div class="mb-6 form-password-toggle">
                <label class="form-label" for="password_confirmation">Confirm Password</label>
                <div class="input-group input-group-merge">
                  <input type="password" id="password_confirmation" class="form-control" name="password_confirmation" placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" aria-describedby="password" />
                  <span class="input-group-text cursor-pointer"><i class="ti ti-eye-off"></i></span>
                </div>
              </div>

              <div class="my-8">
                <div class="form-check mb-0 ms-2">
                  <input class="form-check-input" type="checkbox" id="terms" name="terms">
                  <label class="form-check-label" for="terms">
                    Tôi đồng ý
                    <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#termsModal">chính sách bảo mật và điều khoản</a>
                  </label>
                </div>
              </div>
              <button class="btn btn-primary d-grid w-100">
                Đăng ký
              </button>
            </form>

            <p class="text-center">
              <span>Tôi đã có tài khoản?</span>
              <a href="{{route('login')}}">
                <span>Đăng nhập</span>
              </a>
            </p>

            <div class="divider my-6">
              <div class="divider-text">or</div>
            </div>

            <div class="d-flex justify-content-center">
              <a href="javascript:;" class="btn btn-sm btn-icon rounded-pill btn-text-facebook me-1_5">
                <i class="tf-icons ti ti-brand-facebook-filled"></i>
              </a>

              <a href="javascript:;" class="btn btn-sm btn-icon rounded-pill btn-text-twitter me-1_5">
                <i class="tf-icons ti ti-brand-twitter-filled"></i>
              </a>

              <a href="javascript:;" class="btn btn-sm btn-icon rounded-pill btn-text-github me-1_5">
                <i class="tf-icons ti ti-brand-github-filled"></i>
              </a>

              <a href="javascript:;" class="btn btn-sm btn-icon rounded-pill btn-text-google-plus">
                <i class="tf-icons ti ti-brand-google-filled"></i>
              </a>
            </div>
          </div>
        </div>
        <!-- Register Card -->
      </div>
    </div>
  </div>

{{--  Terms Modal--}}
  <div class="modal fade" id="termsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="policyModalLabel">Chính Sách Bảo Mật & Điều Khoản</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h4>1. Chính Sách Bảo Mật</h4>
          <p>
            Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng. Mọi thông tin thu thập sẽ được sử dụng để nâng cao trải nghiệm mua sắm và bảo vệ quyền lợi của người dùng.
          </p>
          <ul>
            <li>Chúng tôi chỉ thu thập thông tin cần thiết để xử lý đơn hàng.</li>
            <li>Không chia sẻ thông tin khách hàng cho bên thứ ba khi chưa có sự đồng ý.</li>
            <li>Dữ liệu cá nhân được bảo vệ theo tiêu chuẩn bảo mật cao.</li>
          </ul>

          <h4>2. Điều Khoản Sử Dụng</h4>
          <p>
            Khi sử dụng website của chúng tôi, bạn đồng ý với các điều khoản sau:
          </p>
          <ul>
            <li>Không sử dụng website cho mục đích gian lận, lừa đảo.</li>
            <li>Không sao chép, phân phối nội dung của website khi chưa có sự đồng ý.</li>
            <li>Chúng tôi có quyền thay đổi chính sách mà không cần thông báo trước.</li>
          </ul>

          <h4>3. Thanh Toán & Giao Hàng</h4>
          <ul>
            <li>Chúng tôi chấp nhận thanh toán qua nhiều hình thức: tiền mặt, chuyển khoản, ví điện tử.</li>
            <li>Thời gian giao hàng dự kiến từ 2-5 ngày làm việc, tùy vào địa điểm.</li>
            <li>Nếu có vấn đề với đơn hàng, khách hàng vui lòng liên hệ trong vòng 48 giờ.</li>
          </ul>

          <h4>4. Chính Sách Đổi Trả</h4>
          <ul>
            <li>Khách hàng có thể đổi trả sản phẩm trong vòng 7 ngày nếu có lỗi từ nhà sản xuất.</li>
            <li>Sản phẩm phải còn nguyên hộp, phụ kiện và hóa đơn.</li>
            <li>Chi phí vận chuyển khi đổi trả do khách hàng chịu.</li>
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
      </div>
    </div>
  </div>
@endsection
