<?php


exec("git pull");

$date = date("Y-m-d__H_i_s");
$newfile = "session-$date.json";

echo $newfile ."\n";

$newsession = trim(file_get_contents("https://www.devspaceconf.com/api/v1/session"));


$appjs = file_get_contents("app.js");
$sessionpos = stripos($appjs, "getJSON");
$sessionposEnd = stripos($appjs, "function", $sessionpos);

$start = $sessionpos+8;
$stop =  $sessionposEnd - $start;
$sessionfile = substr($appjs, $start, $stop);

$sessionfile = trim(str_ireplace(array("\"", ":", ",", " "), "", $sessionfile));
echo $sessionfile ."\n";

$oldsession = trim(file_get_contents($sessionfile));

if($newsession != $oldsession) {
        echo "Need new DevSpace session\n";
        $appjs = str_replace($sessionfile, $newfile, $appjs);
        file_put_contents($newfile, $newsession);
        file_put_contents("app.js", $appjs);

        echo "Need to update to GitHub\n";
        //exec("git rm $sessionfile");
        //exec("git add app.js $newfile");
        //exec("git commit -m 'Latest DevSpace session'");
        //exec("git push");

} else {
        echo "Do NOT new devspace session\n";
}

echo "\n";
