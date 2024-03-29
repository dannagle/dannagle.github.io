<?php

chdir(__DIR__);

$output = array();
$result = 0;

//github constantly moving hosts around and causing host-added warning.
exec("git fetch 2>/dev/null", $output, $result);

//With that warning gone, I will only get real errors from this.
exec("git pull");

$date = date("Y-m-d__H_i_s");
$newfile = "session-$date.json";


$newsession = trim(@file_get_contents("https://www.devspaceconf.com/api/v1/session"));
//$newsession = trim(file_get_contents("session.txt"));
if(empty($newsession)) {
    echo "Could not reach DevSpace\n";
    exit;
}

$indexhtml = file_get_contents("index.html");
$sessionpos = stripos($indexhtml, "jsonFile");
$sessionposEnd = stripos($indexhtml, "sessions", $sessionpos);

$start = $sessionpos+8;
$stop =  $sessionposEnd - $start;
$sessionfile = substr($indexhtml, $start, $stop);

$sessionfile = trim(str_ireplace(array("\"", ":", ",", " ", "/", ";", "="), "", $sessionfile));

$oldsession = trim(file_get_contents($sessionfile));

$js1 = @json_decode($oldsession, true);
$js2 = @json_decode($newsession, true);


if(empty($js1)) {
    echo "Old session json is bad. Seeding with empty.\n";
    $js1 = [];
}

if(empty($js2)) {
    echo "DevSpace returned bad json\n";
    exit;
}

//DevSpace API has a quirk that a null date returns the current time. This confuses my diff.
//Lets just unset the DisplayDateTime

for($i = 0; $i < count($js1); $i++) {
    $js1[$i]["TimeSlot"]["DisplayDateTime"] = "";
}
for($i = 0; $i < count($js2); $i++) {
    $js2[$i]["TimeSlot"]["DisplayDateTime"] = "";
}

//print_r($js1[0]); exit;

$js1text = json_encode($js1, JSON_PRETTY_PRINT);
$js2text = json_encode($js2, JSON_PRETTY_PRINT);


if($js1text != $js2text) {
    echo "Need new DevSpace session\n";
    $indexhtml = str_replace($sessionfile, $newfile, $indexhtml);
    file_put_contents($newfile, $newsession);
    file_put_contents("index.html", $indexhtml);

    echo "Need to update to GitHub\n";
    exec("git rm $sessionfile");
    exec("git add index.html $newfile");
    exec("git commit -m 'Latest DevSpace session'");
    exec("git push");

} else {
    //echo "DevSpace session is current\n";
}

