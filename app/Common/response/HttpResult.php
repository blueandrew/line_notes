<?php

namespace App\Common\response;

use Illuminate\Http\Request;

class HttpResult
{
    private static function resultJson(){
        $resultJson = [
            'success' => true,
            "message" => 'success',
            'response' => [
                'data'=> '',
            ],
            'error' => [
                'code' => 0,
                'message' => ''
            ]
        ];

        return $resultJson;
    }

    public static function success($data=''){
        $returnJson = self::resultJson();

        $returnJson['success'] = true;
        $returnJson['message'] = 'success';
        $returnJson['response']['data'] = $data;

        return $returnJson;
    }

    public static function error($code, $message){
        $returnJson = self::resultJson();

        $returnJson['success'] = false;
        $returnJson['message'] = 'error';
        $returnJson['error']['code'] = $code;
        $returnJson['error']['message'] = $message;


        return response()->json($returnJson, $code);
    }
}
