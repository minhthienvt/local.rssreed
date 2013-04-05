<?php

namespace SM\Bundle\AdminBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * RssFeed
 *
 * @ORM\Table(name="sm_rssfeed")
 * @ORM\Entity(repositoryClass="SM\Bundle\AdminBundle\Repository\RssFeedRepository")
 * @ORM\HasLifecycleCallbacks
 * @UniqueEntity(fields="external_link", message="External link is already in use")
 * @UniqueEntity(fields="internal_link", message="External link is already in use")
 */
class RssFeed
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255, nullable=true)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="external_link", type="string", length=255)
     */
    private $external_link;

    /**
     * @var string
     *
     * @ORM\Column(name="internal_link", type="string", length=255, nullable=true)
     */
    private $internal_link;

    /**
     * @var integer
     *
     * @ORM\Column(name="time_refesh", type="integer", nullable=true)
     */
    private $time_refesh;

    /**
     * @var boolean
     *
     * @ORM\Column(name="automatic_refesh", type="boolean", nullable=true)
     */
    private $automatic_refesh;

    /**
     * @var integer
     *
     * @ORM\Column(name="begin_refesh", type="integer", nullable=true)
     */
    private $begin_refesh;

    /**
     * @var integer
     *
     * @ORM\Column(name="end_refesh", type="integer", nullable=true)
     */
    private $end_refesh;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $user;

    /**
     * @var integer
     *
     * @ORM\Column(name="status", type="smallint", nullable=true)
     */
    private $status;

    /**
     * @var integer
     *
     * @ORM\Column(name="main_status", type="smallint", nullable=true)
     */
    private $main_status;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=true)
     */
    private $created_at;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=true)
     */
    private $updated_at;

    /**
     * @var integer
     *
     * @ORM\Column(name="time_cron", type="integer", nullable=true)
     */
    private $time_cron;

    /**
     * @var string
     *
     * @ORM\Column(name="email", type="string", nullable=true)
     */
    private $email;


    /**
     * @ORM\PrePersist
     */
    public function setCreatedAtValue()
    {
        if (!$this->getCreatedAt()) {
            $this->created_at = new \DateTime();
            $this->updated_at = new \DateTime();
        }
    }

    /**
     * @ORM\PreUpdate
     */
    public function setUpdatedAtValue()
    {
        $this->updated_at = new \DateTime();
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return RssFeed
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return RssFeed
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set external_link
     *
     * @param string $externalLink
     * @return RssFeed
     */
    public function setExternalLink($externalLink)
    {
        $this->external_link = $externalLink;

        return $this;
    }

    /**
     * Get external_link
     *
     * @return string
     */
    public function getExternalLink()
    {
        return $this->external_link;
    }

    /**
     * Set internal_link
     *
     * @param string $internalLink
     * @return RssFeed
     */
    public function setInternalLink($internalLink)
    {
        $this->internal_link = $internalLink;

        return $this;
    }

    /**
     * Get internal_link
     *
     * @return string
     */
    public function getInternalLink()
    {
        return $this->internal_link;
    }

    /**
     * Set time_refesh
     *
     * @param integer $timeRefesh
     * @return RssFeed
     */
    public function setTimeRefesh($timeRefesh)
    {
        $this->time_refesh = $timeRefesh;

        return $this;
    }

    /**
     * Get time_refesh
     *
     * @return integer
     */
    public function getTimeRefesh()
    {
        return $this->time_refesh;
    }

    /**
     * Set automatic_refesh
     *
     * @param boolean $automaticRefesh
     * @return RssFeed
     */
    public function setAutomaticRefesh($automaticRefesh)
    {
        $this->automatic_refesh = $automaticRefesh;

        return $this;
    }

    /**
     * Get automatic_refesh
     *
     * @return boolean
     */
    public function getAutomaticRefesh()
    {
        return $this->automatic_refesh;
    }

    /**
     * Set begin_refesh
     *
     * @param integer $beginRefesh
     * @return RssFeed
     */
    public function setBeginRefesh($beginRefesh)
    {
        $this->begin_refesh = $beginRefesh;

        return $this;
    }

    /**
     * Get begin_refesh
     *
     * @return integer
     */
    public function getBeginRefesh()
    {
        return $this->begin_refesh;
    }

    /**
     * Set end_refesh
     *
     * @param integer $endRefesh
     * @return RssFeed
     */
    public function setEndRefesh($endRefesh)
    {
        $this->end_refesh = $endRefesh;

        return $this;
    }

    /**
     * Get end_refesh
     *
     * @return integer
     */
    public function getEndRefesh()
    {
        return $this->end_refesh;
    }

    /**
     * Set user
     *
     * @param \SM\Bundle\AdminBundle\Entity\User $user
     * @return Article
     */
    public function setUser(\SM\Bundle\AdminBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \SM\Bundle\AdminBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set status
     *
     * @param integer $status
     * @return RssFeed
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return integer
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set created_at
     *
     * @param \DateTime $createdAt
     * @return RssFeed
     */
    public function setCreatedAt($createdAt)
    {
        $this->created_at = $createdAt;

        return $this;
    }

    /**
     * Get created_at
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * Set updated_at
     *
     * @param \DateTime $updatedAt
     * @return RssFeed
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updated_at = $updatedAt;

        return $this;
    }

    /**
     * Get updated_at
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * Set time_cron
     *
     * @param integer $timeCron
     * @return RssFeed
     */
    public function setTimeCron($timeCron)
    {
        $this->time_cron = $timeCron;

        return $this;
    }

    /**
     * Get time_cron
     *
     * @return integer
     */
    public function getTimeCron()
    {
        return $this->time_cron;
    }

    /**
     * Set status
     *
     * @param integer $status
     * @return RssFeed
     */
    public function setMainStatus($mainStatus)
    {
        $this->main_status = $mainStatus;

        return $this;
    }

    /**
     * Get status
     *
     * @return integer
     */
    public function getMainStatus()
    {
        return $this->main_status;
    }

    /**
     * Set email
     *
     * @param string $email
     * @return RssFeed
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }
}