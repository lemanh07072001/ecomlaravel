<div class="modal fade" id="editRoleUserModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-simple">
    <div class="modal-content">
      <div class="modal-body">
        <button
          type="button"
          class="btn-close btn-pinned"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
        <div class="text-center mb-6">
          <h4 class="mb-2">Cập nhật quyền User</h4>
          <p>Chỉnh sửa quyền theo yêu cầu của bạn.</p>
        </div>
        <div class="alert alert-warning d-flex align-items-start" role="alert">
          <span class="alert-icon me-4 rounded-2"><i class="ti ti-alert-triangle ti-md"></i></span>
          <span>
                          <span class="alert-heading mb-1 h5">Warning</span><br />
                          <span class="mb-0 p"
                          >Chỉnh sửa quyền có thể làm ảnh hưởng dữ liệu hệ thống.
                          Vui lòng đảm bảo bạn hoàn toàn chắc chắn trước khi tiếp tục.</span
                          >
                        </span>
        </div>
        <form id="editRoleUserForm" class="row pt-2 row-gap-2 gx-4" >
          <div class="col-sm-9">
            <div class="mb-3">
              <label for="selectRoleUser" class="form-label">Quyền</label>
              <select id="selectRoleUser" name="role" class="select2-icons form-select">

              </select>
            </div>
          </div>
          <div class="col-sm-3 mb-4">
            <label class="form-label invisible d-none d-sm-inline-block">Button</label>
            <button type="submit" class="btn btn-primary mt-1 mt-sm-0 w-100" id="submitRoleUser">Update</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</div>
