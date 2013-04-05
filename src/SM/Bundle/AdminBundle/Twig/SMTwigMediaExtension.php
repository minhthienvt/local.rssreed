<?php

namespace SM\Bundle\AdminBundle\Twig;

/**
 * Twig extendsion for media popup
 */
class SMTwigMediaExtension extends \Twig_Extension
{

    private $environment;

    /**
     * Return name of extendsion
     *
     * @return string Name of extendsion
     */
    public function getName()
    {
        return 'sm.twig.media_extension';
    }

    /**
     * Init environment
     *
     * @param \Twig_Environment $environment
     */
    public function initRuntime(\Twig_Environment $environment)
    {
        $this->environment = $environment;
    }

    /**
     * Get Functions
     *
     * @return type
     */
    public function getFunctions()
    {
        return array(
            'smmedia' => new \Twig_Function_Method($this, 'selectMedia'),
        );
    }

    /**
     * Generate options for render new template
     *
     * @param type $optMedias      $selectedMedias
     * @param type $selectedMedias $selectedMedias
     * @param type $selectName     $selectedMedias
     * @param type $multiple       $selectedMedias
     * @param type $required       $selectedMedias
     * @param type $mediaPath      $selectedMedias
     *
     * @return type
     */
    public function selectMedia($optMedias, $selectName = 'media_id', $mediaPath = '' , $options = array())
    {
        return $this->environment->render(
                'SMAdminBundle:Twig:media.html.twig',
                array(
                    'optMedias' => $optMedias,
                    'mediaName' => $selectName,
                    'mediaPath' => $mediaPath,
                    'options' => $options,
                ));
    }

}

