<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PermissionController extends Controller
{
    protected $service;

    public function __construct(PermissionService $permissionService)
    {
      $this->service = $permissionService;
    }

    public function index()
    {

        return view('admin.permission.index');
    }

    public function getPermissions()
    {
        return $this->service->getPermissions();
    }

    public function getRoles()
    {
      return $this->service->getRoles();
    }

    public function addRole(Request $request)
    {
      $validator = Validator::make($request->all(), [
        'name' => 'required|string|unique:roles,name|min:6|max:255',
      ],[
        'name.required' => 'Tên vai trò không được để trống.',
        'name.string'   => 'Tên vai trò phải là một chuỗi ký tự.',
        'name.unique'   => 'Tên vai trò này đã tồn tại, vui lòng chọn tên khác.',
        'name.min'      => 'Tên vai trò không đuọc nhỏ hơn :min ký tự.',
        'name.max'      => 'Tên vai trò không đuọc lớn hơn :max ký tự.',
      ]);

      if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
      }

      return $this->service->addRole($request);
    }

    public function editRole(Request $request)
    {
      $id = $request->input('id');

      $validator = Validator::make($request->all(), [
        'name' => 'required|string|min:6|max:255|unique:roles,name,'.$id,
      ],[
        'name.required' => 'Tên vai trò không được để trống.',
        'name.string'   => 'Tên vai trò phải là một chuỗi ký tự.',
        'name.unique'   => 'Tên vai trò này đã tồn tại, vui lòng chọn tên khác.',
        'name.min'      => 'Tên vai trò không đuọc nhỏ hơn :min ký tự.',
        'name.max'      => 'Tên vai trò không đuọc lớn hơn :max ký tự.',
      ]);

      if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
      }

      return $this->service->editRole($request);
    }

    public function deleteRole(Request $request)
    {
      return $this->service->deleteRole($request);
    }

    public function getEditPermissions(Request $request)
    {
      return $this->service->getEditPermissions($request);
    }

    public function getUserList(Request $request)
    {
        return $this->service->getUserList($request);
    }
}
