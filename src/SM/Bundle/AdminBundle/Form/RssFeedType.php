<?php

namespace SM\Bundle\AdminBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class RssFeedType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', 'text', array(
                'attr' => array(
                    'size' => 255,
                    'style' => "width:635px"
                ),
                'required' => false
            ))
            ->add('description', 'textarea', array(
                'attr' => array(
                    'class' => 'tinymce',
                    'data-theme' => 'medium'
                ),
                'required' => false
            ))
            ->add('external_link', 'text', array(
                'attr' => array(
                    'style' => "width:635px"
                ),
                'required' => false
            ))
            ->add('time_refesh', 'choice', array(
                'choices' => array(
                    '30' => '30 Minutes',
                    '60' => '60 Minutes',
                    '10080' => '1 Week',
                    '20160' => '2 Weeks',
                    '43200' => '1 Month',
                )
            ))
            ->add('automatic_refesh')
            ->add('begin_refesh', 'text', array(
                'attr' => array(
                    'style' => "width:100px"
                ),
                'required' => false,
            ))
            ->add('end_refesh', 'text', array(
                'attr' => array(
                    'style' => "width:100px"
                ),
                'required' => false,
            ))
            ->add('main_status', 'choice', array(
                'choices' => array(
                    '1' => 'Validate',
                    '2' => 'Non Validate',
                    '3' => 'Non disponible',
                )
            ))
        ;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'SM\Bundle\AdminBundle\Entity\RssFeed'
        ));
    }

    public function getName()
    {
        return 'sm_bundle_adminbundle_rssfeedtype';
    }
}
