<?php

namespace SM\Bundle\AdminBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * MenuRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class MenuRepository extends EntityRepository
{

    /**
     * getChildren
     *
     * @param type $parentId the parent id
     *
     * @return @return array
     */
    public function getChildren($parentId)
    {
        return $this->getEntityManager()
                        ->getRepository('SMAdminBUndle:Menu')
                        ->createQueryBuilder('c')
                        ->where('c.parent = :parentId')
                        ->andWhere('c.parent != c.id')
                        ->setParameter('parentId', $parentId)
                        ->orderBy('c.lft', 'ASC')
                        ->getQuery()
                        ->getResult();
    }

    /**
     * @return boolean
     */
    public function rebuildLftRgt()
    {
        //get all parent tree
        $trees = $this->getEntityManager()
                ->getRepository('SMAdminBUndle:Menu')
                ->createQueryBuilder('c')
                ->where('c.parent IS NULL')
                ->getQuery()
                ->getResult();

        $begin = 1;
        $end = 0;
        $em = $this->_em;
        foreach ($trees as $tree) {
            $this->postOrderTraversal($tree, $begin, $end, $em);
            $begin = $end + 1;
        }
        $em->flush();

        return true;
    }

    /**
     * @param type $tree  tree
     * @param type $begin begin
     * @param type &$end  end
     * @param type $em    em
     */
    public function postOrderTraversal($tree, $begin, &$end, $em)
    {
        //get $tree childrens
        $children = $em->getRepository('SMAdminBUndle:Menu')
                ->getChildren($tree->getId());
        $tree->setLft($begin);
        $end = ++$begin;
        //Travesal the tree
        foreach ($children as $child) {
            $repositor = $em->getRepository('SMAdminBUndle:Menu');
            $repositor->postOrderTraversal($child, $begin, $end, $em);
            $begin = ++$end;
        }
        $tree->setRgt($end);
    }

    /**
     * @param \SM\Bundle\AdminBundle\Entity\Menu $menu the menu
     */
    public function moveUp(\SM\Bundle\AdminBundle\Entity\Menu $menu)
    {
        //get the area upper
        $em = $this->_em;
        $repositor = $em->getRepository('SMAdminBUndle:Menu');
        $menuUpper = $repositor->findOneBy(array('rgt' => ($menu->getLft() - 1)));
        if ($menuUpper) {
            $del1 = $menu->getRgt() - $menu->getLft();
            $del2 = $menuUpper->getRgt() - $menuUpper->getLft();

            //calculate new lft, rgt of 2 node and swap
            $menu->setLft($menuUpper->getLft());
            $menu->setRgt($menu->getLft() + $del1);
            $menuUpper->setLft($menu->getRgt() + 1);
            $menuUpper->setRgt($menuUpper->getLft() + $del2);
            $end = 0;
            //save new order
            $repositor->postOrderTraversal($menuUpper, $menuUpper->getLft(), $end, $em);
            $repositor->postOrderTraversal($menu, $menu->getLft(), $end, $em);

            $em->persist($menu);
            $em->persist($menuUpper);
            $em->flush();
        }
    }

    /**
     * @param \SM\Bundle\AdminBundle\Entity\Menu $menu the menu
     */
    public function moveDown(\SM\Bundle\AdminBundle\Entity\Menu $menu)
    {
        //get the area under
        $em = $this->_em;
        $repositor = $em->getRepository('SMAdminBUndle:Menu');
        $menuUnder = $repositor->findOneBy(array('lft' => ($menu->getRgt() + 1)));
        if ($menuUnder) {
            $del1 = $menu->getRgt() - $menu->getLft();
            $del2 = $menuUnder->getRgt() - $menuUnder->getLft();

            //calculate new lft, rgt of 2 node and swap
            $menuUnder->setLft($menu->getLft());
            $menuUnder->setRgt($menu->getLft() + $del2);
            $menu->setLft($menuUnder->getRgt() + 1);
            $menu->setRgt($menu->getLft() + $del1);
            $end = 0;
            //save new order
            $repositor->postOrderTraversal($menuUnder, $menuUnder->getLft(), $end, $em);
            $repositor->postOrderTraversal($menu, $menu->getLft(), $end, $em);

            $em->persist($menu);
            $em->persist($menuUnder);
            $em->flush();
        }
    }

    /**
     * @param type $lft lft
     * @param type $rgt rgt
     *
     * @return type
     */
    public function getAllChildren($lft, $rgt)
    {
        return $this->getEntityManager()
                        ->getRepository('SMAdminBUndle:Menu')
                        ->createQueryBuilder('c')
                        ->where('c.lft >= :lft')
                        ->andWhere('c.rgt != :rgt')
                        ->setParameters(array('lft' => $lft, 'rgt' => $rgt))
                        ->orderBy('c.lft', 'ASC')
                        ->getQuery()
                        ->getResult();
    }

}
