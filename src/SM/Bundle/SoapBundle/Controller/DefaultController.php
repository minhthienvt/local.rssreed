<?php
namespace SM\Bundle\SoapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

require_once 'RssService.php';

class DefaultController extends Controller
{
    public function serverAction(Request $request)
    {
        // initialize server and set URI
        $options = array('wsdl_cache' => '0');
        $baseurl = $request->getScheme() . '://'
                        . $request->getHttpHost()
                        . $request->getBasePath();

        $url = $baseurl . '/soap/wsdl';
        //$server = new \Zend_Soap_Server($url);
        $server = new \Zend_Soap_Server(null, array('uri' => $url));
        // set SOAP service class
        $server->setClass('RssService');
        // handle request
        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml; charset=ISO-8859-1');
        ob_start();
        $server->handle();
        if (ob_get_length() > 0) {
            $response->setContent(ob_get_clean());
        }
        return $response;
    }

    /**
     * @todo handle request
     * @return void
     */
    public function wsdlAction (Request $request)
    {
        ini_set("soap.wsdl_cache_enabled", 0);
        $baseurl = $request->getScheme() . '://'
                        . $request->getHttpHost()
                        . $request->getBasePath();
        $url = $baseurl . '/soap/server';
        // set up WSDL auto-discovery
        $wsdl = new \Zend_Soap_AutoDiscover();
        // attach SOAP service class
        $wsdl->setClass('RssService');
        $wsdl->setUri($url);
        // handle request
        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml; charset=ISO-8859-1');
        ob_start();
        $wsdl->handle();
        if (ob_get_length() > 0) {
            $response->setContent(ob_get_clean());
        }
        return $response;
    }
}
