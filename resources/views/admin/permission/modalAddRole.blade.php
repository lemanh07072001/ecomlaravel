

<div class="modal fade" id="addRoleModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-simple modal-dialog-centered modal-add-new-role">
    <div class="modal-content">
      <div class="modal-body">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        <div class="text-center mb-6">
          <h4 class="role-title mb-2">Thêm vai trò mới</h4>
          <p>Thiết lập quyền vai trò</p>
        </div>
        <!-- Add role form -->
        <form id="addRoleForm" class="row g-6" >
          <div class="col-12">
            <div class="mb-1">
              <label for="name" class="form-label ">Tên vai trò</label>
              <input type="text" class="form-control" id="name" name="name" placeholder="Nhập tên vai trò ..." autofocus>
            </div>
          </div>
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-2">Quyền & vai trò</h5>
              <label class="list-group-item">
                <input class="form-check-input me-1" type="checkbox" id="selectAll" />
                Chọn tất cả
              </label>
            </div>
            <!-- Permission table -->
            <div class="table-responsive">
              <div id="roleTable" class="accordion mt-3 accordion-bordered m-2 overflow-y-scroll" style="height: 300px">

              </div>
            </div>
            <!-- Permission table -->
          </div>
          <div class="col-12 text-center">
            <button type="submit" class="btn btn-primary me-3" id="btnSubmit">Xác nhận</button>
            <button
              type="reset"
              class="btn btn-label-secondary"
              data-bs-dismiss="modal"
              aria-label="Close">
              Cancel
            </button>
          </div>
        </form>
        <!--/ Add role form -->
      </div>
    </div>
  </div>
</div><?php
