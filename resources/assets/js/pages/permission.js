'use strict';

$(function () {
  const MODAL_ADD_ROLE = $('#addRoleModal');
  const ROLE_TABLE = $('#roleTable');
  const FORM_PERMISSION_ADD = $('#addRoleForm')[0];

  const MODAL_EDIT_ROLE = $('#editRoleModal');
  const ROLE_TABLE_EDIT = $('#roleTableEdit');
  const FORM_PERMISSION_EDIT = $('#editRoleForm')[0];

  const PERMISSION_SUBMIT_BTN_ADD = $('#btnSubmitAdd');
  const PERMISSION_SUBMIT_BTN_EDIT = $('#btnSubmitEdit');

  const LIST_CARD_ROLE = $('.list_card_role');
  const BTN_DELETE = '.btnDelete';

  const DT_USER_TABLE = $('.datatables-users ');

  let formPermissionEdit;
  let formPermissionAdd;

  window.permission = {
    init              : function () {
      permission.ShowAddModalRole();
      permission.ShowEditModalRole();
      permission.CreateModalRole();
      permission.SelectAllCheckBox();
      permission.RenderBoxRoles();
      permission.DeleteRole();
      permission.OptionToast();
      permission.HandleModalRoleAdd();
      permission.HandleModalRoleEdit();
      permission.EditModalRole();
      permission.ListUser();
    },
    OptionToast           : function () {
      toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: 'toast-top-center',
        preventDuplicates: false,
        onclick: null,
        showDuration: '3000',
        hideDuration: '1000',
        timeOut: '2000',
        extendedTimeOut: '1000',
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut'
      };
    },
    ShowAddModalRole      : function () {
      $(MODAL_ADD_ROLE).on('show.bs.modal', function () {
        $.ajax({
          url: URL_GET_PERMISSIONS,
          method: 'get',
          success: function (req) {
            let html = '';
            console.log(req);
            html += `
                 ${Object.entries(req)
                   .map(
                     ([group, permissionList], index) => `
                       <div class="text-light fw-medium mt-3">${group}</div>
                        <div class="demo-inline-spacing mt-4">
                        <div class="list-group">
                        ${permissionList
                          .map(
                            permission => `
                              <label class="list-group-item">
                                <input class="form-check-input me-1 select-input" type="checkbox"  value="${permission.id}" data-id="${permission.id}" data-name="${permission.name}"/>
                                ${permission.name}
                              </label>
                              `
                          )
                          .join('')}

                        </div>
                      </div>
                        `
                   )
                   .join('')}
              `;
            $(ROLE_TABLE).html(html);
          }
        });
      });
    },
    HandleModalRoleAdd     : function () {

      // Khi mở Modal
      $(MODAL_ADD_ROLE).on('shown.bs.modal', function () {

      });

      // Khi đóng Modal
      $(MODAL_ADD_ROLE).on('hide.bs.modal', function () {
        $('#name').val('');
        $('#selectAll').prop('checked', false);

        //Reset Form
        if (formPermissionAdd){
          formPermissionAdd.resetForm(true)
        }
      });
    },
    HandleModalRoleEdit    : function () {
      // khi mở Modal
      $(MODAL_EDIT_ROLE).on('shown.bs.modal', function () {
        let allChecked = true; // Giả định tất cả đều được check

        $('#editRoleForm .select-input').each(function () {
          if (!$(this).prop('checked')) {
            allChecked = false; // Nếu có ít nhất một checkbox không được check
            return false; // Thoát khỏi vòng lặp
          }
        });

        // Cập nhật trạng thái checkbox "Select All"
        $('#editRoleForm #selectAll').prop('checked', allChecked);
      });



      // Khi đóng Modal
      $(MODAL_EDIT_ROLE).on('hide.bs.modal', function () {
        if (formPermissionEdit) {
          formPermissionEdit.resetForm(true);
        }
      });
    },
    CreateModalRole       : function () {
      formPermissionAdd = FormValidation.formValidation(FORM_PERMISSION_ADD, {
        fields: {
          name: {
            validators: {
              notEmpty: {
                message: 'Vui lòng nhập tên vai trò.'
              },
              stringLength: {
                min: 6,
                max: 255,
                message: 'Tên vai trò phải có từ 6 đến 255 ký tự'
              },
              blank: {}
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap5: new FormValidation.plugins.Bootstrap5({
            eleValidClass: '',
            rowSelector: '.mb-1'
          }),
          submitButton: new FormValidation.plugins.SubmitButton(),
          autoFocus: new FormValidation.plugins.AutoFocus()
        },
        init: instance => {
          instance.on('plugins.message.placed', function (e) {
            if (e.element.parentElement.classList.contains('input-group')) {
              e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
            }
          });
        }
      }).on('core.form.valid', function (e) {
        let arrayRoles = [];

        $('#addRoleForm .select-input:checked').each(function () {
          arrayRoles.push($(this).data('name'));
        });

        const DATA = {
          name: $('#name').val(),
          arrayRoles: arrayRoles,
          _token: $('meta[name="csrf-token"]').attr('content')
        };

        $.ajax({
          url: URL_ADD_ROLE,
          method: 'post',
          data: DATA,
          dataType: 'json',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            var html =
              '<div class="d-flex justify-content-center align-items-center;">' +
              '<span class="spinner-border me-2 " style="width: 20px; height: 20px" role="status" aria-hidden="true"></span> ' +
              '<span>Đang xử lý ...</span></div> ';
            PERMISSION_SUBMIT_BTN_ADD.html('').html(html).attr('disabled', true);
          },
          success: function (data) {
            if (data.success === true) {
              // Hiện thông báo đăng nhập thành công.
              toastr.success(data.message, 'Thành công!');

              setTimeout(function () {
                MODAL_ADD_ROLE.modal('hide');

                // Render lại dũe liệu
                permission.RenderBoxRoles();
              }, 200);
            } else {
              toastr.error(data.message, 'Thất bại!');
            }
          },
          error: function (response) {
            // Hiện thông báo lỗi lỗi
            if (response.responseJSON.success === false) {
              toastr.error(response.responseJSON.message, 'Thất bại');
            }

            // Hiện thông báo lỗi trường input do server trả về
            let errors = response.responseJSON.errors;

            for (const field in errors) {
              let message = errors[field].join(', ');
              formPermission
                // Update the message option
                .updateValidatorOption(field, 'blank', 'message', message)
                // Set the field as invalid
                .updateFieldStatus(field, 'Invalid', 'blank');
            }
          }
        })
          .done(function () {
            PERMISSION_SUBMIT_BTN_ADD.html('Xác nhận');
            PERMISSION_SUBMIT_BTN_ADD.prop('disabled', false);
          })
          .fail(function () {
            PERMISSION_SUBMIT_BTN_ADD.html('Xác nhận');
            PERMISSION_SUBMIT_BTN_ADD.prop('disabled', false);
          });
      });
    },
    SelectAllCheckBox     : function () {
      // ModalAdd
      $('#addRoleForm #selectAll').on('click', function () {
        let isChecked = $(this).prop('checked'); // Kiểm tra trạng thái của checkbox "Chọn tất cả"
        $('#addRoleForm .select-input').prop('checked', isChecked); // Đặt trạng thái cho tất cả checkbox khác
      });

      $(document).on('click', ' #addRoleForm .select-input', function () {
        let allChecked = $('#addRoleForm .select-input').length === $('.select-input:checked').length;
        $('#addRoleForm #selectAll').prop('checked', allChecked);
      });

      // Modal Edit
      $('#editRoleForm #selectAll').on('click', function () {
        let isChecked = $(this).prop('checked'); // Kiểm tra trạng thái của checkbox "Chọn tất cả"
        $('#editRoleForm .select-input').prop('checked', isChecked); // Đặt trạng thái cho tất cả checkbox khác
      });

      $(document).on('click', ' #editRoleForm .select-input', function () {
        let allChecked = $('#editRoleForm .select-input').length === $('.select-input:checked').length;
        $('#editRoleForm #selectAll').prop('checked', allChecked);
      });
    },
    RenderBoxRoles        : function () {
      $.ajax({
        url: URL_RENDER_ROLE,
        method: 'get',
        success: function (req) {
          console.log(req);
          let data = req.data;

          if (req.success) {
            permission.HtmlBoxRoles(data);
          }
        }
      });
    },
    HtmlBoxRoles          : function (data) {
      let html = '';
      $(data).each(function (key, item) {
        html += `
              <div class="col-xl-4 col-lg-6 col-md-6">
                  <div class="card h-100">
                      <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center mb-4">
                              <h6 class="fw-normal mb-0 text-body">Tổng số ${item.users.length} users</h6>
                              <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
              `;

        // Lặp qua tối đa 4 users đầu tiên
        item.users.slice(0, 4).forEach(user => {
          html += `
                              <li
                                  data-bs-toggle="tooltip"
                                  data-popup="tooltip-custom"
                                  data-bs-placement="top"
                                  title="${user.name}"
                                  class="avatar pull-up">
                                  <img class="rounded-circle" src="${user.avatar ? ASSETS_URL(user.avatar) : ASSETS_URL('assets/img/avatars/5.png')}" alt="Avatar" />
                              </li>
                          `;
        });

        // Nếu còn user, hiển thị +x user còn lại
        if (item.users.length > 4) {
          html += `
                      <li class="avatar">
                          <span
                              class="avatar-initial rounded-circle pull-up"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="${item.users.length - 4} more">
                              +${item.users.length - 4}
                          </span>
                      </li>
                  `;
        }

        html += `
                              </ul>
                          </div>
                          <div class="d-flex justify-content-between align-items-end">
                              <div class="role-heading">
                                  <h5 class="mb-1">${item.name}</h5>

                                  <a href="javascript:;" class="role-edit-modal btnEdit" data-id="${item.id}">
                                      <span>${item.name != 'Super Admin' ? 'Edit Role' : ''}</span>
                                  </a>
                              </div>
                              ${item.name != 'Super Admin' ? '<a class="btnDelete" href="javascript:void(0);" data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" title="Xoá" data-id="' + item.id + '"><i class="fa-solid fa-trash-can text-heading"></i></a>' : ''}
                          </div>
                      </div>
                  </div>
              </div>
              `;
      });
      html += `
            <div class="col-xl-4 col-lg-6 col-md-6">
              <div class="card h-100">
                <div class="row h-100">
                  <div class="col-sm-5">
                    <div class="d-flex align-items-end h-100 justify-content-center mt-sm-0 mt-4">
                      <img
                        src="${ASSETS_URL('assets/img/illustrations/add-new-roles.png')}"
                        class="img-fluid mt-sm-4 mt-md-0"
                        alt="add-new-roles"
                        width="83" />
                    </div>
                  </div>
                  <div class="col-sm-7">
                    <div class="card-body text-sm-end text-center ps-sm-0">
                      <button
                        data-bs-target="#addRoleModal"
                        data-bs-toggle="modal"
                        class="btn btn-sm btn-primary mb-4 text-nowrap add-new-role">
                        Thêm mới vai trò
                      </button>
                      <p class="mb-0">
                        Thêm vai trò mới,<br/>
                        nếu vai trò đó chưa tồn tại.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `;
      // Chèn HTML vào DOM
      $(LIST_CARD_ROLE).html(html);

      $('[data-bs-toggle="tooltip"]').tooltip();

      return html;
    },
    DeleteRole            : function () {
      $(document).on('click', BTN_DELETE, function () {
        let id = $(this).data('id');

        Swal.fire({
          title: 'Bạn có chắc muốn xoá?',
          text: 'Xoá là không thể khôi phục lại được!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Đồng ý!',
          customClass: {
            confirmButton: 'btn btn-primary me-1',
            cancelButton: 'btn btn-label-secondary'
          },
          buttonsStyling: false
        }).then(function (result) {
          if (result.isConfirmed) {
            $.ajax({
              url: URL_DELETE_ROLE,
              method: 'delete',
              dataType: 'json',
              data: {
                id: id
              },
              beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
              },
              success: function (req) {
                if (req.success) {
                  toastr.success(req.message, 'Thành công!');

                  setTimeout(function () {
                    // Render lại dũe liệu
                    permission.RenderBoxRoles();
                  }, 200);
                } else {
                  toastr.error(req.message, 'Thất bại!');
                }
              }
            });
          }
        });
      });
    },
    ShowEditModalRole     : function () {
      $(document).on('click', '.btnEdit', function () {
        let roleId = $(this).data('id'); // Lấy ID từ button
        MODAL_EDIT_ROLE.data('id', roleId); // Gán ID vào modal
        MODAL_EDIT_ROLE.modal('show');
      });

      $(MODAL_EDIT_ROLE).on('show.bs.modal', function (event) {
        $.ajax({
          url: URL_GET_EDIT_PERMISSIONS,
          method: 'get',
          data: {
            id: $(this).data('id')
          },
          success: function (req) {
            let data = req?.data?.dataPermission;
            let permissionArray = req?.data?.getArrayIdPermission;
            let roleName = req?.data?.roleName;

            let html = '';

            if (req.success){
              $('#editRoleForm #name').val(roleName)

              html += `
                 ${Object.entries(data)
                .map(
                  ([group, permissionList], index) => `
                       <div class="text-light fw-medium mt-3">${group}</div>
                        <div class="demo-inline-spacing mt-4">
                        <div class="list-group">
                        ${permissionList
                    .map(
                      permission => `
                              <label class="list-group-item">
                                <input class="form-check-input me-1 select-input" type="checkbox"  value="${permission.id}" data-id="${permission.id}" data-name="${permission.name}" ${permissionArray.includes(permission.id) ? 'checked' : ''}/>
                                ${permission.name}
                              </label>
                              `
                    )
                    .join('')}

                        </div>
                      </div>
                        `
                )
                .join('')}
              `;
              $(ROLE_TABLE_EDIT).html(html);
            }

          }
        });
      });
    },
    EditModalRole         : function(){
      formPermissionEdit = FormValidation.formValidation(FORM_PERMISSION_EDIT, {
        fields: {
          name: {
            validators: {
              notEmpty: {
                message: 'Vui lòng nhập tên vai trò.'
              },
              stringLength: {
                min: 6,
                max: 255,
                message: 'Tên vai trò phải có từ 6 đến 255 ký tự'
              },
              blank: {}
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap5: new FormValidation.plugins.Bootstrap5({
            eleValidClass: '',
            rowSelector: '.mb-1'
          }),
          submitButton: new FormValidation.plugins.SubmitButton(),
          autoFocus: new FormValidation.plugins.AutoFocus()
        },
        init: instance => {
          instance.on('plugins.message.placed', function (e) {
            if (e.element.parentElement.classList.contains('input-group')) {
              e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
            }
          });
        }
      }).on('core.form.valid', function (e) {
        let arrayRoles = [];

        $('#editRoleForm .select-input:checked').each(function () {
          arrayRoles.push($(this).data('name'));
        });

        const DATA = {
          name: $('#editRoleForm #name').val(),
          id: MODAL_EDIT_ROLE.data('id'),
          arrayRoles: arrayRoles,
          _token: $('meta[name="csrf-token"]').attr('content')
        };

        $.ajax({
          url: URL_EDIT_ROLE,
          method: 'post',
          data: DATA,
          dataType: 'json',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            var html =
              '<div class="d-flex justify-content-center align-items-center;">' +
              '<span class="spinner-border me-2 " style="width: 20px; height: 20px" role="status" aria-hidden="true"></span> ' +
              '<span>Đang xử lý ...</span></div> ';
            PERMISSION_SUBMIT_BTN_EDIT.html('').html(html).attr('disabled', true);
          },
          success: function (data) {
            if (data.success === true) {
              // Hiện thông báo đăng nhập thành công.
              toastr.success(data.message, 'Thành công!');

              setTimeout(function () {
                MODAL_EDIT_ROLE.modal('hide');

                // Render lại dũe liệu
                permission.RenderBoxRoles();
              }, 200);
            } else {
              toastr.error(data.message, 'Thất bại!');
            }
          },
          error: function (response) {
            // Hiện thông báo lỗi lỗi
            if (response.responseJSON.success === false) {
              toastr.error(response.responseJSON.message, 'Thất bại');
            }

            // Hiện thông báo lỗi trường input do server trả về
            let errors = response.responseJSON.errors;

            for (const field in errors) {
              let message = errors[field].join(', ');
              formPermission
                // Update the message option
                .updateValidatorOption(field, 'blank', 'message', message)
                // Set the field as invalid
                .updateFieldStatus(field, 'Invalid', 'blank');
            }
          }
        })
          .done(function () {
            PERMISSION_SUBMIT_BTN_EDIT.html('Xác nhận');
            PERMISSION_SUBMIT_BTN_EDIT.prop('disabled', false);
          })
          .fail(function () {
            PERMISSION_SUBMIT_BTN_EDIT.html('Xác nhận');
            PERMISSION_SUBMIT_BTN_EDIT.prop('disabled', false);
          });
      });


    },
    ListUser              : function(){
      var dtUser = DT_USER_TABLE.DataTable({
        ajax: URL_GET_USERS, // JSON file to add data
        columns: [
          // columns according to JSON
          { data: 'id' },
          { data: 'full_name' },
          { data: 'role' },
          { data: 'status' },
          { data: '' }
        ],
        columnDefs: [
          {
            // For Responsive
            className: 'control',
            orderable: false,
            searchable: false,
            responsivePriority: 2,
            targets: 0,
            render: function (data, type, full, meta) {
              return '';
            }
          },
          {
            // For Checkboxes
            targets: 1,
            orderable: false,
            checkboxes: {
              selectAllRender: '<input type="checkbox" class="form-check-input">'
            },
            render: function () {

            },
            searchable: false
          },
          {
            // User full name and email
            targets: 2,
            title: 'USER',
            orderable: false,
            responsivePriority: 4,
            render: function (data, type, full, meta) {
              console.log(full);

            }
          },
          {
            // User Role
            title: 'Role',
            targets: 3,
            orderable: false,
            render: function (data, type, full, meta) {

            }
          },
          {
            // User Status
            title: 'Status',
            targets: 4,
            orderable: false,
            render: function (data, type, full, meta) {

            }
          },
          {
            // Actions
            targets: -1,
            title: 'Actions',
            searchable: false,
            orderable: false,
            render: function (data, type, full, meta) {

            }
          }
        ],
        order: [[2, 'desc']],

        language: {
          sLengthMenu: 'Show _MENU_',
          search: '',
          searchPlaceholder: 'Search User',
          paginate: {
            next: '<i class="ti ti-chevron-right ti-sm"></i>',
            previous: '<i class="ti ti-chevron-left ti-sm"></i>'
          }
        },


      });
    }
  };

  $(document).ready(function () {
    permission.init();
  });
});
