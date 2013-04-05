Deployment for ITCE RSS with Symfony2

1) Get Composer with command :
-----------------------------

    php -r "eval('?>'.file_get_contents('https://getcomposer.org/installer'));"

2) Get Symfony2 standard components :
------------------------------------

    php composer.phar install

3) Configuration for DB
-----------------------
	- Edit app/config/parameters.yml to config database and config host
	- Edit app/config/parameters.yml to config time_cron that to run cron job

4) Generate DB and Entity
-------------------------

    - Run in command line to generate database:
        php app/console doctrine:schema:update --force

    - Setup default User, Language run in command line:
        php app/console doctrine:fixtures:load

5) Clear all cache before run application
-----------------------------------------
    php app/console assets:install web
    php app/console cache:clear


Have fun !

NOTE for Developer:
	- Call web service. We assume call web service by Zend

	$baseurl = 'http://itce-rss.awakit.sutrix.com/web';
        $serverLink = $baseurl . '/soap/server';
        $options = array('location' => $serverLink, 'uri' => $serverLink);
        try {
            $client = new \Zend_Soap_Client(null, $options);
	    $link = 'http://feeds.bbci.co.uk/news/rss.xml';
            $result = $client->getLocalRssLink($link);
            echo "<pre>";
	    print_r($result); //Array
				//(
				//    [status] => 1
				//    [link] => http://itce-rss.awakit.sutrix.com/web/uploads/rss-feed/512c659d76a75.xml
				//)

        } catch (\SoapFault $s){
            die('ERROR: [' . $s->faultcode . '] ' . $s->faultstring);
        }

	- Cron job : php path_to/project/app rss:refesh
