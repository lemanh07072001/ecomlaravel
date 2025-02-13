@php
$configData = Helper::appClasses();
@endphp

@extends('layouts/layoutMaster')

@section('title', 'Home')

@section('page-script')
  @vite([
    'resources/assets/js/pages/permission.js'
  ])

  <script>
    const URL_GET_PERMISSIONS = {{ Illuminate\Support\Js::from(route('getPermissions')) }};
    const URL_ADD_ROLE = {{ Illuminate\Support\Js::from(route('addRole')) }};
    const URL_RENDER_ROLE = {{ Illuminate\Support\Js::from(route('getRoles')) }};
    const URL_DELETE_ROLE = {{ Illuminate\Support\Js::from(route('deleteRole')) }};
    const URL_GET_EDIT_PERMISSIONS = {{ Illuminate\Support\Js::from(route('getEditPermissions')) }};
    const URL_EDIT_ROLE = {{ Illuminate\Support\Js::from(route('editRole')) }};
    const URL_GET_USERS = {{ Illuminate\Support\Js::from(route('getUserList')) }};

    const ASSETS_URL = function(url){
      return "{{ asset('') }}" + url;
    }
  </script>
@endsection

@section('content')
  <h4 class="mb-1">Danh sách vai trò</h4>

  <p class="mb-6">
    Một vai trò cung cấp quyền truy cập vào các menu và tính năng được xác định trước để tùy thuộc vào <br />
    vai trò được chỉ định, quản trị viên có thể truy cập vào những gì người dùng cần.
  </p>
  <!-- Role cards -->
  <div class="row g-6">
    @include('admin.permission.cardRole')
    <div class="col-12">
      <h4 class="mt-6 mb-1">Tổng số người dùng với vai trò của họ</h4>
      <p class="mb-0">Tìm tất cả tài khoản quản trị viên của công ty bạn và vai trò liên kết của họ.</p>
    </div>
    <div class="col-12">
      <!-- Role Table -->
      <div class="card">
        <div class="card-datatable table-responsive">
          @include('admin.permission.tableRole')
        </div>
      </div>
      <!--/ Role Table -->
    </div>
  </div>
  <!--/ Role cards -->

  <!-- Add Role Modal -->
  @include('admin.permission.modalAddRole')
  <!--/ Add Role Modal -->

  <!-- Edit Role Modal -->
  @include('admin.permission.modalEditRole')
  <!--/ Edit Role Modal -->

@endsection
