<?php
namespace App\Helpers;

class ResponseHelper
{
  public static function senError($message, $data = [], $status = 200) {
    return response()->json([
      'message' => $message,
      'success' => false,
      'data' => $data
    ], $status);
  }

  public static function senErrorSMM($message, $data = [], $status = 200) {
    return response()->json([
      'error' => $message,
    ], $status);
  }

  public static function senSucess($message, $data = [], $status = 200) {
    return response()->json([
      'message' => $message,
      'success' => true,
      'data' => $data
    ], $status);
  }

  //send success for datatable
  public static function senSucessV2($message = '', $data = []) {
    $res = [];
    if ($message) $res = array_merge($res, ['message'   => $message]);
    return response()->json([
      'message' => $message,
      'success' => true,
      $data
    ], 200);
  }
}
