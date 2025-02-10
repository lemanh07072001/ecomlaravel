'use strict';

$(function () {

  const FORM_REGISTER = $('#formRegister')[0];
  const REGISTER_SUBMIT_BTN = $('#btnRegister');

  window.register = {
    init: function () {
      register.FormRegister();
    },
    FormRegister: function () {
      const formRegister = FormValidation.formValidation(FORM_REGISTER, {
        fields: {
          username: {
            validators: {
              notEmpty: {
                message: 'Vui lòng nhập họ tên.',

              },
              stringLength: {
                min: 6,
                max: 255,
                message: 'Họ tên phải có từ 6 đến 255 ký tự',

              },
              blank: {}
            }
          },
          email: {
            validators: {
              notEmpty: {
                message: 'Vui lòng nhập Email.',
              },
              stringLength: {
                min: 6,
                max: 255,
                message: 'Email phải có từ 6 đến 255 ký tự',
              },
              emailAddress: {
                message: 'Email không đúng định dạng.',
              },
              blank: {}
            }
          },
          password: {
            validators: {
              notEmpty: {
                message: 'Vui lòng nhập mật khẩu.'
              },
              stringLength: {
                min: 8,
                message: 'Mật khẩu phải có ít nhất 8 ký tự.'
              },
              blank: {}
            }
          },
          password_confirmation: {
            validators: {
              notEmpty: { message: 'Vui lòng nhập lại mật khẩu.' },
              stringLength: {
                min: 8,
                message: 'Mật khẩu phải có ít nhất 8 ký tự.'
              },
              identical: {
                compare: function () {
                  return document.getElementById('password').value;
                },
                message: 'Mật khẩu nhập lại không khớp.'
              },
              blank: {}
            }
          },
          terms: {
            validators: {
              notEmpty: {
                message: 'Vui lòng đồng ý các điều khoản và điều kiện'
              }
            }
          }

        },
        verbose: false,
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap5: new FormValidation.plugins.Bootstrap5({
            eleValidClass: '',
            rowSelector: '.mb-6'
          }),
          submitButton: new FormValidation.plugins.SubmitButton(),
          autoFocus: new FormValidation.plugins.AutoFocus(),
          sequence: new FormValidation.plugins.Sequence()

        },
        init: instance => {
          instance.on('plugins.message.placed', function (e) {
            if (e.element.parentElement.classList.contains('input-group')) {
              e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
            }
          });
        }
      }).on('core.form.valid', function (e) {
        const DATA = {
          username                : $('#username').val(),
          email                   : $('#email').val(),
          password                : $('#password').val(),
          password_confirmation   : $('#password_confirmation').val(),
          terms                   : $('#terms').val(),
          _token                  : $('meta[name="csrf-token"]').attr('content')
        };

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

        $.ajax({
          url: '/register',
          method: 'post',
          data: DATA,
          dataType: 'json',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            var html =
              '<div class="d-flex justify-content-center align-items-center;">' +
              '<span class="spinner-border me-2 " style="width: 20px; height: 20px" role="status" aria-hidden="true"></span> ' +
              '<span>Đang đăng ký ...</span></div> ';
            REGISTER_SUBMIT_BTN.html('').html(html).attr('disabled', true);
          },
          success: function (data) {

            if (data.success === true) {
              // Hiện thông báo đăng nhập thành công.
              toastr.success(data.message, 'Thành công!');

              setTimeout(function () {
                window.location.href = URL_LOGIN;
              }, 2000);

            } else {
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
              formRegister
                // Update the message option
                .updateValidatorOption(field, 'blank', 'message', message)
                // Set the field as invalid
                .updateFieldStatus(field, 'Invalid', 'blank');
            }
          }
        })
          .done(function () {
            REGISTER_SUBMIT_BTN.html('Đăng ký');
            REGISTER_SUBMIT_BTN.prop('disabled', false);
          })
          .fail(function () {
            REGISTER_SUBMIT_BTN.html('Đăng ký');
            REGISTER_SUBMIT_BTN.prop('disabled', false);
          });
      });
    }
  };

  $(document).ready(function () {
    register.init();
  });
});
