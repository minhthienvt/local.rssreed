<?php
namespace SM\Bundle\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use SM\Bundle\AdminBundle\Entity\RssFeed;
use SM\Bundle\AdminBundle\Form\RssFeedType;

use SM\Bundle\AdminBundle\Utilities\Rss;

/**
 * RssFeed controller.
 *
 */
class RssFeedController extends Controller
{
    /**
     * Lists all RssFeed entities.
     *
     */
    public function indexAction($page)
    {
        $rep = $this->getDoctrine()
                    ->getRepository("SMAdminBundle:RssFeed");

        $total = $rep->getTotal();
        $perPage = $this->container->getParameter('per_item_page');;

        $lastPage = ceil($total / $perPage);
        $previousPage = $page > 1 ? $page - 1 : 1;
        $nextPage = $page < $lastPage ? $page + 1 : $lastPage;
        $entities = $rep->getList($perPage, ($page - 1) * $perPage, array(), array('created_at' => 'desc'));

        return $this->render('SMAdminBundle:RssFeed:index.html.twig', array(
            'entities' => $entities,
            'lastPage' => $lastPage,
            'previousPage' => $previousPage,
            'currentPage' => $page,
            'nextPage' => $nextPage,
            'total' => $total
        ));
    }

    /**
     * Finds and displays a RssFeed entity.
     *
     */
    public function showAction($id)
    {

        $rep = $this->getDoctrine()
                    ->getRepository("SMAdminBundle:RssFeed");

        $entity = $rep->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find RssFeed entity.');
        }

        $itemFeeds = $rep->getItemFeedsByEntity($entity);

        return $this->render('SMAdminBundle:RssFeed:show.html.twig', array(
            'entity'        => $entity,
            'itemFeeds'     => $itemFeeds,
        ));
    }

    /**
     * Displays a form to create a new RssFeed entity.
     *
     */
    public function newAction()
    {
        $entity = new RssFeed();
        $form   = $this->createForm(new RssFeedType(), $entity);

        return $this->render('SMAdminBundle:RssFeed:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Creates a new RssFeed entity.
     *
     */
    public function createAction(Request $request)
    {

        $repRssFeed = $this->getDoctrine()
                    ->getRepository("SMAdminBundle:RssFeed");

        $entity  = new RssFeed();
        $form = $this->createForm(new RssFeedType(), $entity);
        $form->bind($request);

        if ($form->isValid()) {
            $user = $this->get('security.context')->getToken()->getUser();

            $pathFileXml = $this->container->get('kernel')->getRootDir()
                            . '/../web/'
                            . $this->container->getParameter('dir_rss_feed');

            $baseurl = $request->getScheme() . '://'
                        . $request->getHttpHost()
                        . $request->getBasePath()
                        . $this->container->getParameter('dir_rss_feed');

            $repRssFeed->addByEntity($entity, $pathFileXml, $baseurl, $user);

            return $this->redirect($this->generateUrl('admin_rssfeed_show', array('id' => $entity->getId())));
        }

        return $this->render('SMAdminBundle:RssFeed:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing RssFeed entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('SMAdminBundle:RssFeed')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find RssFeed entity.');
        }

        $editForm = $this->createForm(new RssFeedType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('SMAdminBundle:RssFeed:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing RssFeed entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $repRssFeed = $this->getDoctrine()
                    ->getRepository("SMAdminBundle:RssFeed");

        $entity = $repRssFeed->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find RssFeed entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new RssFeedType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $user = $this->get('security.context')->getToken()->getUser();

            $pathFileXml = $this->container->get('kernel')->getRootDir()
                            . '/../web/' . $this->container->getParameter('dir_rss_feed');

            $baseurl = $request->getScheme() . '://'
                        . $request->getHttpHost()
                        . $request->getBasePath()
                        . $this->container->getParameter('dir_rss_feed');

            $repRssFeed->updateByEntity($entity, $pathFileXml, $user, $baseurl);

            //return $this->redirect($this->generateUrl('admin_rssfeed_edit', array('id' => $id)));
            return $this->redirect($this->generateUrl('admin_rssfeed_show', array('id' => $entity->getId())));
        }

        return $this->render('SMAdminBundle:RssFeed:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a RssFeed entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $pathFileXml = $this->container->get('kernel')->getRootDir()
                            . '/../web/' . $this->container->getParameter('dir_rss_feed');

        if (is_array($id)) {
            $this->getDoctrine()
                ->getRepository("SMAdminBundle:RssFeed")
                ->deleteByIds($id, $pathFileXml);
        } else {
            $this->getDoctrine()
                ->getRepository("SMAdminBundle:RssFeed")
                ->deleteByIds(array($id), $pathFileXml);
        }

        return $this->redirect(
            $this->generateUrl('admin_rssfeed')
        );
    }

    /**
     * Deletes a RssFeed entity.
     *
     */
    public function deleteAllAction(Request $request)
    {
        $pathFileXml = $this->container->get('kernel')->getRootDir()
                            . '/../web/' . $this->container->getParameter('dir_rss_feed');
        $id = $request->get('checklist');
        if (is_array($id)) {
            $this->getDoctrine()
                ->getRepository("SMAdminBundle:RssFeed")
                ->deleteByIds($id, $pathFileXml);
        } else {
            $this->getDoctrine()
                ->getRepository("SMAdminBundle:RssFeed")
                ->deleteByIds(array($id), $pathFileXml);
        }

        return $this->redirect(
            $this->generateUrl('admin_rssfeed')
        );
    }


    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }

    public function refeshRssAction(Request $request, $id)
    {
        $repRssFeed = $this->getDoctrine()
                    ->getRepository("SMAdminBundle:RssFeed");

        $entity = $repRssFeed->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find RssFeed entity.');
        }

        $user = $this->get('security.context')->getToken()->getUser();

        $pathFileXml = $this->container->get('kernel')->getRootDir()
                        . '/../web/' . $this->container->getParameter('dir_rss_feed');

        $baseurl = $request->getScheme() . '://'
                    . $request->getHttpHost()
                    . $request->getBasePath()
                    . $this->container->getParameter('dir_rss_feed');

        $repRssFeed->updateByEntity($entity, $pathFileXml, $user, $baseurl);

        return $this->redirect(
            $this->generateUrl('admin_rssfeed')
        );
    }

    public function testAction(Request $request)
    {
        $baseurl = $request->getScheme() . '://'
                        . $request->getHttpHost()
                        . $request->getBasePath();

        $serverLink = $baseurl . '/soap/server';

        $options = array('location' => $serverLink, 'uri' => $serverLink);
        try {
            $client = new \Zend_Soap_Client(null, $options);
            //$link = 'http://vietbao.vn/live/Kinh-te/rss.xml';
            //$link = 'http://vietbao.vn/rss2/trang-nhat.rss';
            //$link = 'http://vietbao.vn/rss2/tinmoi.rss';
            //$link = 'http://vietbao.vn/live/An-ninh-Phap-luat/rss.xml';
            //$link = 'http://vietbao.vn/live/Blog/rss.xml';
            //$link = 'http://vietbao.vn/live/Bong-da/rss.xml';
            //$link = 'http://feeds.thongtincongnghe.com/ttcn/vienthong';
            //$link = 'http://feeds.thongtincongnghe.com/ttcn/maytinh';
            //$link = 'http://feeds.thongtincongnghe.com/ttcn/dienthoai';
            //$link = 'http://feeds.thongtincongnghe.com/ttcn/thietbiso';
            $link = 'http://vtc.vn/RssCate.aspx';
            //$link = 'http://feeds.bbci.co.uk/news/rss.xml';
            $result = $client->getLocalRssLink($link, 'abc@yahoo.com');
            echo "<pre>";print_r($result);die;
        } catch (\SoapFault $s){
            die('ERROR: [' . $s->faultcode . '] ' . $s->faultstring);
        }
    }
}