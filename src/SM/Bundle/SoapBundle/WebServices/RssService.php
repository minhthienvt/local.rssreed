<?php
use SM\Bundle\SoapBundle\SMSoapBundle;

class RssService
{
    public function getLocalRssLink($link = '', $email = '')
    {
        $em = SMSoapBundle::getContainer()->get('doctrine')->getEntityManager('default');
	$usr = SMSoapBundle::getContainer()->getParameter('rss_user');
 	$pwd = SMSoapBundle::getContainer()->getParameter('rss_password');
        $rep = $em->getRepository("SMAdminBundle:RssFeed");
        return $rep->getInternalLinkAndStatusByLinkFromWebService($link, $email, $usr, $pwd);
    }
}
