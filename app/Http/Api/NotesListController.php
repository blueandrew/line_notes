<?php

namespace App\Http\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config; 
use App\Common\response\HttpResult;


class NotesListController extends Controller
{
    public function checkUrlSecurity(Request $request)
    {
        $regexPattern = "/^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/";
        $returnCode = 200;
        $returnMessage = '';
        $data = '';

        $checkUrl = $request->url;

        if(empty($checkUrl)){
            $returnCode = 400;
            $returnMessage = '參數錯誤';

            return HttpResult::error($returnCode, $returnMessage);
        }

        if(!preg_match($regexPattern, $checkUrl)){
            $returnCode = 400;
            $returnMessage = '參數格式錯誤';

            return HttpResult::error($returnCode, $returnMessage);
        }

        $apiKey = config('googleSafeBrowsing.google_safe_browsing_api_key');
        $checkResponse = Http::accept('application/json')
            ->post("https://safebrowsing.googleapis.com/v4/threatMatches:find?key=$apiKey", [
                "client" => [
                    "clientId" => "blue",
                    "clientVersion" => "1"
                ],
                "threatInfo" => [
                    "threatTypes" => ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                    "platformTypes" => ["ALL_PLATFORMS"],
                    "threatEntryTypes" => ["URL"],
                    "threatEntries" => [
                        ["url" => $checkUrl]
                    ]
                ]
            ]);
    
        $statusCode = $checkResponse->getStatusCode();
        $checkUrlData = $checkResponse->json();

        if($statusCode==200) {
            if($checkUrlData != []) {
                $threatType = $checkUrlData['matches'][0]['threatType'];
                $platformType = $checkUrlData['matches'][0]['platformType'];
                $data = '危險類型: '.$threatType.', 平台類型: '.$platformType;
            }

            return HttpResult::success($data);
        }else{
            $returnCode = $statusCode;
            $returnMessage = 'Api 錯誤. 錯誤代碼: '.$statusCode;

            return HttpResult::error($returnCode, $returnMessage);
        }
    }
}