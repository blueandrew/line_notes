<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config; 

use App\Http\Resources\ResponsesResource;

class NotesListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function checkUrlSecurity(Request $request)
    {
        $data = [
            'success' => false,
            'response' => [
                'data'=> '',
            ],
            'errors' => [
                'code' => 0,
                'message' => ''
            ]
        ];

        $checkUrl = $request->url;
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
    
        $StatusCode = $checkResponse->getStatusCode();
        $checkJsonData = $checkResponse->json();

        if($StatusCode==200) {
            if($checkJsonData == []) {
                $data['success'] = true;
            }else{
                $threatType = $checkJsonData['matches'][0]['threatType'];
                $platformType = $checkJsonData['matches'][0]['platformType'];
    
                $data['success'] = false;
                $data['errors']['code'] = 4001;
                $data['errors']['message'] = "threatType: $threatType, platformType: $platformType";
            }
        }else{
            $data['success'] = false;
                $data['errors']['code'] = 500;
                $data['errors']['message'] = "Api server error code: $StatusCode";
        }
        

        return response()->json($data, 200);
    }
}