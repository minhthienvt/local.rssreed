<?php

namespace SM\Bundle\AdminBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

/**
 * UserType
 */
class UserType extends AbstractType
{
    /**
     * buildForm
     *
     * @param \Symfony\Component\Form\FormBuilderInterface $builder builder
     * @param array                                        $options options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username')
            ->add('fullname')
            ->add('password')
            ->add('email')
            ->add('role_collection')
            ->add('group');
    }

    /**
     * @param \Symfony\Component\OptionsResolver\OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'SM\Bundle\AdminBundle\Entity\User'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'sm_bundle_adminbundle_usertype';
    }
}
