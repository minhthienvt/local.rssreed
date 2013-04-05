<?php
namespace SM\Bundle\AdminBundle\Utilities;

class File
{
    /**
     * create file
     * @param type $content
     * @param type $path
     * @return string
     */
    public static function createFileByContent($content = '', $path = '')
    {
        $orginalFile = uniqid() . ".xml";
        $fileName = $path . '/' . $orginalFile;
        $fileHandle = fopen($fileName, 'w') or die("can't open file");
        file_put_contents($fileName, $content);
        fclose($fileHandle);
        return $orginalFile;
    }

    /**
     * Edit content of the fileName
     * @param type $content
     * @param type $fileName
     */
    public static function editFileByContent($content = '', $fileName = '')
    {
        $fileHandle = fopen($fileName, 'w') or die("can't open file");
        file_put_contents($fileName, $content);
        fclose($fileHandle);
    }
}