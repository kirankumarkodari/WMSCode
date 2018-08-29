using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Web.Script.Services;
using System.Xml;

namespace WMS
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        /* Single Camera Method Start */
        [WebMethod]
        [ScriptMethod]
        public static Image_class[] getdata(timesInfo times)
        {
            try {
                List<Image_class> Image_list = new List<Image_class>();
                Image_class tmp_imgobject;
                

                long fromdatetime_int = Convert.ToInt64(times.fromdate);


                long todatetime_int = Convert.ToInt64(times.todate);

                string Cam_number= times.Cam_no;

                string base_direcory = "D:\\CamImages\\"; // For Testing in My System.

                // string base_direcory = "D:\\IOT\\RWM\\WMS DeploymentRD\\OnlineImages\\";  // For Testing in Our Office 
            

                //  string Cam_number = "0404071616613178";


                //   string[] allfiles = System.IO.Directory.GetFiles("D:\\IOT\\RWM\\WMS Deployment\\OnlineImages", "*.jpg", System.IO.SearchOption.AllDirectories);

                string[] allfiles = System.IO.Directory.GetFiles("D:\\CamImages", "*.jpg", System.IO.SearchOption.AllDirectories);

               // string[] allfiles = System.IO.Directory.GetFiles("D:\\IOT\\RWM\\WMS DeploymentRD\\OnlineImages", "*.jpg", System.IO.SearchOption.AllDirectories);


                DateTime created_time = new DateTime();
                Console.WriteLine("Files Count:" + allfiles.Length);
                foreach (var file in allfiles)
                {
                    FileInfo info = new FileInfo(file);
                    
                    
                    
                    string filename = Path.GetFileNameWithoutExtension(info.FullName);

                    if (filename.Length == 40) // Because Our System is placing files whose name is 40 characters long
                    {

                        if (filename.Substring(24, 16).Equals(Cam_number)) // If Last 16 characters of file name is equal to camera number(IMSI) given by the user.
                        {

                            if (info.Length > 0)
                            {
                                string filename_to_send = Path.GetFileName(info.FullName);
                                string filename_with_format, filename_format;
                                if (filename.Length >= 14)
                                {
                                    string filename_compare = filename.Substring(0, 14); //yyyymmddhhmmss
                                    long filename_int = Convert.ToInt64(filename_compare);
                                    if ((filename_int >= fromdatetime_int) && (filename_int <= todatetime_int))

                                    {

                                        created_time = info.CreationTime;
                                        filename_with_format = Convert.ToString(filename_int);// Converting Long to String 
                                        filename_format = filename_with_format.Substring(0, 4) + '-' + filename_with_format.Substring(4, 2) + '-' + filename_with_format.Substring(6, 2) + ' ' + filename_with_format.Substring(8, 2) + ':' + filename_with_format.Substring(10, 2) + ':' + filename_with_format.Substring(12, 2);
                                        string full_path_filename = base_direcory + filename_to_send;
                                        if (IsValidImage(full_path_filename))
                                        {
                                            tmp_imgobject = new Image_class()
                                            {
                                                img_name = filename_format,
                                                img_path = "CamImages\\" + filename_to_send /* For Testing in My System */
                                               // img_path = "OnlineImages\\" + filename_to_send /* For Testing in Our Office, Mangalagiri Site */
                                            };
                                            Image_list.Add(tmp_imgobject);
                                        }
                                        else
                                        {
                                            /* Log the Improper images of each camera  */

                                        }

                                    }
                                }
                            }  // End of Validating file bytes length >0
                        }
                        else
                        {
                            // Image is not related to selected camera number , So discard packet 
                        }
                        
                    }
                    else
                    {
                        //Discard the Image if image_name is 40 characters only.
                    }
                }
                /*
                TimeSpan difference = DateTime.Now - created_time; // to calculate the difference of two datetimes.
                int minutes=(int)difference.TotalMinutes; // to Convert minutes difference to integer. 
                if(minutes>=5)                            // if image created time is greater than 1 minute than you should not remove the latest image.
                {
                        // No need of removing the last Image.
                }
                else // Image is just have been created, So you should not send that image to client to show.
                {
                    Image_list.RemoveAt(Image_list.Count - 1); // to remove the last image details beacuse it is being created.
                }*/
               
                Image_list.Reverse(); // to reverse the images to give latest images first because it is in old to latest.

                return Image_list.ToArray();
            }
            catch(Exception ex)
            {
               string excep= ex.Message;
                return null;
            }
        }
        /* End of Single Camera Method */


        [WebMethod]
        [ScriptMethod]
        public static string Test()
        {
            return ("test");
        }


        [WebMethod]
        [ScriptMethod]
        public static CameraInfo[] getCameraInfo(tmp_data tmpinfo)
        {
            try
            {
                CameraInfo CameraInfoObj;
                List<CameraInfo> Cameras_list = new List<CameraInfo>();
                string ConfigFilePath;
#if DEBUG
                ConfigFilePath = GlobalVariables.ConfigurationFilePath_Debug;
#else
                ConfigFilePath = GlobalVariables.ConfigurationFilePath_Release;
#endif
                if(File.Exists(ConfigFilePath))
                {
                    XmlDocument doc = new XmlDocument();
                    doc.Load(ConfigFilePath);
                    XmlNodeList elem = doc.GetElementsByTagName("Camera");
                    foreach (XmlNode tag in elem)
                    {
                        CameraInfoObj = new CameraInfo()
                        {
                            CameraID = tag.Attributes["CameraID"].Value,
                            CameraName = tag.Attributes["Cameraname"].Value,
                            CameraIMSI = tag.Attributes["CameraIMSI"].Value
                        };
                        Cameras_list.Add(CameraInfoObj);
                    }
                    return Cameras_list.ToArray();  // To Return Configured Camera Details ...
                }
                else
                {
                    return null;    // To Return null when .XML file Not Exists 
                }
            }
            catch(Exception ex)
            {
                return null;
            }
        }

        public static bool IsValidImage(string full_file_path)
        {
            try
            {
                byte[] bytes = File.ReadAllBytes(full_file_path);
                byte first_one_byte = bytes[0];
                byte first_second_byte = bytes[1];
                byte last_second_byte = bytes[bytes.Length - 2];
                byte last_one_byte = bytes[bytes.Length - 1];  // Last One Byte 


                byte FF = 255;
                byte D8 = 216;
                byte D9 = 217;

                if ((first_one_byte.Equals(FF)) && (first_second_byte.Equals(D8)) && (last_one_byte.Equals(FF) || (last_second_byte.Equals(FF))))
                {
                    return true;
                }
                else
                {
                    return false;

                }
            }
            catch(Exception ex)
            {
                return false;
            }
           
       }

        /* Start of All Cameras Method */
        [WebMethod]
        [ScriptMethod]
        public static Camera[] GetImagesOfReqCameras(RequestObjectForCameras RequestObjectForAllCameras)
        {
            try
            {
                Image_class tmp_ImgObject; // To Store Image Path and as well as Image_name 
                Camera CameraObj;
#if DEBUG
                var directory = new DirectoryInfo(GlobalVariables.BaseDirectory_Debug);
                var RelativePath = GlobalVariables.RelativeDirectory_Debug;
#else
                var directory=new DirectoryInfo(GlobalVariables.BaseDirectory_Release);
                var RelativePath = GlobalVariables.RelativeDirectory_Release;
#endif

                ALLCameras ResponseObj = new ALLCameras();
                
                foreach (RequestCamObject ReuestCamObj in RequestObjectForAllCameras.CamIMSI_arr)/* To Process & Return the Images for All Requested Cameras */
                {

                    string CamIMSINumber = ReuestCamObj.IMSI; // Camera IMSI Number
                    CameraObj = new Camera();
                    try
                    {
                        var RecentImageFileOfCamera = (from Image in directory.GetFiles("*" + CamIMSINumber + GlobalVariables.ImageExtension, SearchOption.AllDirectories)
                                                       orderby Image.LastWriteTime descending
                                                       select Image).First();
                        if (RecentImageFileOfCamera != null) /* Camera Existed and It Has posted the Images */
                        {
                            string ImageName = Path.GetFileNameWithoutExtension(RecentImageFileOfCamera.FullName);

                            string DateTimeOfIMage = ImageName.Substring(0, 14);

                            string LastSyncTime = ImageName.Substring(0, 4) + '-' + ImageName.Substring(4, 2) + '-' + ImageName.Substring(6, 2) + ' ' + ImageName.Substring(8, 2) + ':' + ImageName.Substring(10, 2) + ':' + ImageName.Substring(12, 2);

                            long fromdatetime_longInt = Convert.ToInt64(RequestObjectForAllCameras.fromdate); /* Converting string to LongInt */

                            long todatetime_longInt = Convert.ToInt64(RequestObjectForAllCameras.todate); /* Converting string to LongInt */

                            long DateTimeOfIMage_longInt = Convert.ToInt64(DateTimeOfIMage); /* Converting string to LongInt */

                            CameraObj.LastSyncTime = LastSyncTime;  // Last Synctime of the Camera

                            CameraObj.IMSI = CamIMSINumber;         // IMSI Number of the Camera
                             
                            CameraObj.CameraID= ReuestCamObj.CameraID; // CameraID of the Camera

                            DateTime LastSyncDatetime = Convert.ToDateTime(LastSyncTime);        // Converting Last Synctime string to Datetime

                            DateTime PresentDatetime = DateTime.Now;                             // Present Date Time 

                            TimeSpan difference = PresentDatetime - LastSyncDatetime; // to calculate the difference of two datetimes.
                            int minutes = (int)difference.TotalMinutes; // to Convert minutes difference to integer.

                            if(minutes<=GlobalVariables.MaxMinutesoConsiderOffLine)
                            {
                                /* Consider Camera as Online */
                                CameraObj.Online_Sts = GlobalVariables.OnLine;
                            }
                            else
                            {
                                /* Consider Camera as Offline */
                                CameraObj.Online_Sts = GlobalVariables.OffLine;
                            }

                            if (DateTimeOfIMage_longInt >= fromdatetime_longInt) /* So Images are there to proceed */
                            {
                                

                                var AllFilesOfCamera = directory.GetFiles("*" + CamIMSINumber + GlobalVariables.ImageExtension, SearchOption.AllDirectories);
                                foreach(var file in AllFilesOfCamera) /*To Iterate through All Files of that Camera */
                                {
                                    string tmpImageName = Path.GetFileNameWithoutExtension(file.FullName); /* Get Image name */
                                    if(tmpImageName.Length>=40)
                                    {
                                        string tmpDateTimeOfImage = tmpImageName.Substring(0, 14);
                                        long tmpDateTimeOfImage_longInt = Convert.ToInt64(tmpDateTimeOfImage);
                                        if (tmpDateTimeOfImage_longInt >= fromdatetime_longInt && tmpDateTimeOfImage_longInt <= todatetime_longInt)
                                        {
                                            /* Image has created in the requested time period */

                                            string tmpImageNameFormat = tmpDateTimeOfImage.Substring(0, 4) + '-' + tmpDateTimeOfImage.Substring(4, 2) + '-' + tmpDateTimeOfImage.Substring(6, 2) + ' ' + tmpDateTimeOfImage.Substring(8, 2) + ':' + tmpDateTimeOfImage.Substring(10, 2) + ':' + tmpDateTimeOfImage.Substring(12, 2);
                                            if (IsValidImage(file.FullName))
                                            {
                                                tmp_ImgObject = new Image_class()
                                                {
                                                    img_name = tmpImageNameFormat,
#if DEBUG
                                                    img_path = GlobalVariables.RelativeDirectory_Debug + Path.GetFileName(file.FullName) /* For Testing in My System */
#else
                                            img_path = GlobalVariables.RelativeDirectory_Release + Path.GetFileName(file.FullName)
#endif
                                                };
                                                CameraObj.Images.Add(tmp_ImgObject); //Adding Image to the ListofImages of that Camera
                                            }
                                            else
                                            {

                                            }
                                        }
                                    }
                                    
                                }
                                CameraObj.Images.Reverse(); /* To Make images in sorted order */
                            }
                            else
                            {
                                /* No Need of framing Image objects */
                                
                            }
                        }
                    }
                    catch(Exception ex) /* There is No images related to that Camera*/
                    {
                        /* Camera Not Existed & has Not posted single image  */
                        CameraObj.IMSI = CamIMSINumber;
                        CameraObj.CameraID = ReuestCamObj.CameraID; // CameraID of the Camera
                        CameraObj.LastSyncTime = "";
                        CameraObj.Online_Sts = GlobalVariables.OffLine;
                    }
                    ResponseObj.CameraList.Add(CameraObj);
                }
                return ResponseObj.CameraList.ToArray();
            }
            catch(Exception ex)
            {
                return null;
            }
        }
        /*End of All Cameras Method */



        /* Start of All Cameras Videos Method */
        [WebMethod]
        [ScriptMethod]
        public static Camera[] GetVideosOfReqCameras(RequestObjectForCameras RequestObjectForAllCameras)
        {
            try
            {
                Video_class tmp_Object; // To Store Video Path and as well as Image_name 
                Camera CameraObj;
#if DEBUG
                var directory = new DirectoryInfo(GlobalVariables.BaseDirectory_Debug);
                var RelativePath = GlobalVariables.RelativeDirectory_Debug;
#else
                var directory=new DirectoryInfo(GlobalVariables.BaseDirectory_Release);
                var RelativePath = GlobalVariables.RelativeDirectory_Release;
#endif

                ALLCameras ResponseObj = new ALLCameras();

                foreach (RequestCamObject ReuestCamObj in RequestObjectForAllCameras.CamIMSI_arr)/* To Process & Return the Images for All Requested Cameras */
                {

                    string CamIMSINumber = ReuestCamObj.IMSI; // Camera IMSI Number
                    CameraObj = new Camera();
                    try
                    {
                        var RecentImageFileOfCamera = (from Image in directory.GetFiles("*" + CamIMSINumber + GlobalVariables.ImageExtension, SearchOption.TopDirectoryOnly)
                                                       orderby Image.LastWriteTime descending
                                                       select Image).First();
                        if (RecentImageFileOfCamera != null) /* Camera Existed and It Has posted the Images */
                        {
                            string ImageName = Path.GetFileNameWithoutExtension(RecentImageFileOfCamera.FullName);

                            string DateTimeOfIMage = ImageName.Substring(0, 14);  /* Only date has stored with Video name */

                            string LastSyncTime = ImageName.Substring(0, 4) + '-' + ImageName.Substring(4, 2) + '-' + ImageName.Substring(6, 2) + ' ' + ImageName.Substring(8, 2) + ':' + ImageName.Substring(10, 2) + ':' + ImageName.Substring(12, 2);

                            long fromdatetime_longInt = Convert.ToInt64(RequestObjectForAllCameras.fromdate); /* Converting string to LongInt */

                            long todatetime_longInt = Convert.ToInt64(RequestObjectForAllCameras.todate); /* Converting string to LongInt */

                            long DateTimeOfIMage_longInt = Convert.ToInt64(DateTimeOfIMage); /* Converting string to LongInt */

                            CameraObj.LastSyncTime = LastSyncTime;  // Last Synctime of the Camera

                            CameraObj.IMSI = CamIMSINumber;         // IMSI Number of the Camera

                            CameraObj.CameraID = ReuestCamObj.CameraID; // CameraID of the Camera

                            DateTime LastSyncDatetime = Convert.ToDateTime(LastSyncTime);        // Converting Last Synctime string to Datetime

                            DateTime PresentDatetime = DateTime.Now;                             // Present Date Time 

                            TimeSpan difference = PresentDatetime - LastSyncDatetime; // to calculate the difference of two datetimes.
                            int minutes = (int)difference.TotalMinutes; // to Convert minutes difference to integer.

                            if (minutes <= GlobalVariables.MaxMinutesoConsiderOffLine)
                            {
                                /* Consider Camera as Online */
                                CameraObj.Online_Sts = GlobalVariables.OnLine;
                            }
                            else
                            {
                                /* Consider Camera as Offline */
                                CameraObj.Online_Sts = GlobalVariables.OffLine;
                            }
#if DEBUG
                            var Timelapsedirectory = new DirectoryInfo(GlobalVariables.BaseDirectoryTimelapse_Debug);
                            var TimelapseRelativePath = GlobalVariables.TimelapseRelativeDirectory_Debug;
#else
                            var Timelapsedirectory=new DirectoryInfo(GlobalVariables.BaseDirectoryTimelapse_Release);
                            var TimelapseRelativePath = GlobalVariables.TimelapseRelativeDirectory_Release;
#endif
                            var RecentVideoFileOfCamera = (from Vedio in Timelapsedirectory.GetFiles("*" + CamIMSINumber + GlobalVariables.VideoExtension, SearchOption.TopDirectoryOnly)
                                                           orderby Vedio.LastWriteTime descending
                                                           select Vedio).First();
                            if (RecentVideoFileOfCamera != null) /* Camera Existed and It Has posted the Images */
                            {
                                string Videoname = Path.GetFileNameWithoutExtension(RecentVideoFileOfCamera.FullName);

                                string DateOfVideo = Videoname.Substring(0, 8);  /* Only date has stored with Video name */

                                long DateOfVideo_Int = Convert.ToInt64(DateOfVideo);

                                if (DateOfVideo_Int >= fromdatetime_longInt) /* So Videos are there to proceed */
                                {
                                    var AllFilesOfCamera = Timelapsedirectory.GetFiles("*" + CamIMSINumber + GlobalVariables.VideoExtension, SearchOption.TopDirectoryOnly);
                                    foreach (var file in AllFilesOfCamera) /*To Iterate through All Files of that Camera */
                                    {
                                        string tmpVideoName = Path.GetFileNameWithoutExtension(file.FullName); /* Get Image name */
                                        string tmpDateTimeOfVideo = tmpVideoName.Substring(0, 8);
                                        
                                        
                                        long tmpDateTimeOfImage_longInt = Convert.ToInt64(tmpDateTimeOfVideo);
                                        if (tmpDateTimeOfImage_longInt >= fromdatetime_longInt && tmpDateTimeOfImage_longInt <= todatetime_longInt)
                                        {
                                            /* Image has created in the requested time period */
                                            FileInfo FirstImageOfCamera=null;
                                            try
                                            {
                                                FirstImageOfCamera = (from Image in directory.GetFiles(tmpDateTimeOfVideo + "*" + CamIMSINumber + GlobalVariables.ImageExtension, SearchOption.TopDirectoryOnly)
                                                                       orderby Image.LastWriteTime ascending
                                                                       select Image).First();
                                            }
                                             catch(Exception ex)
                                            {
                                                FirstImageOfCamera = null;
                                            }
                                            string Thumbnail_image_name = "";
                                            if (FirstImageOfCamera != null)
                                            {
                                                Thumbnail_image_name = Path.GetFileName(FirstImageOfCamera.FullName);
                                            }

                                             string tmpImageNameFormat = tmpDateTimeOfVideo.Substring(0, 4) + '-' + tmpDateTimeOfVideo.Substring(4, 2) + '-' + tmpDateTimeOfVideo.Substring(6, 2);

                                               tmp_Object = new Video_class()
                                                {
                                                    Video_name = tmpImageNameFormat,
                                                    
#if DEBUG
                                                    Video_path= TimelapseRelativePath + Path.GetFileName(file.FullName),/* For Testing in My System */
                                                    Videothumbnail_img_path = GlobalVariables.RelativeDirectory_Debug+Thumbnail_image_name
#else
                                                    Video_path= TimelapseRelativePath + Path.GetFileName(file.FullName),/* For Testing in My System */
                                                    Videothumbnail_img_path = GlobalVariables.RelativeDirectory_Release+Thumbnail_image_name

#endif
                                                };
                                                CameraObj.Videos.Add(tmp_Object); //Adding Image to the ListofImages of that Camera
                                        }
                                    }
                                    CameraObj.Videos.Reverse(); /* To Make Videos in sorted order */
                                }
                                else
                                {
                                    /* No Need of framing Image objects */

                                }
                            }
                           
                        }
                    }
                    catch (Exception ex) /* There is No images related to that Camera*/
                    {
                        /* Camera Not Existed & has Not posted single image  */
                        CameraObj.IMSI = CamIMSINumber;
                        CameraObj.CameraID = ReuestCamObj.CameraID; // CameraID of the Camera
                        CameraObj.LastSyncTime = "";
                        CameraObj.Online_Sts = GlobalVariables.OffLine;
                    }
                    ResponseObj.CameraList.Add(CameraObj);
                }
                return ResponseObj.CameraList.ToArray();
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        /*End of All Cameras Videos Method */
        [WebMethod]
        [ScriptMethod]
        public static CreateCameraResponsecode AddCamera(NewCamera Camera)
        {
            CreateCameraResponsecode Response = new CreateCameraResponsecode();
            
            try
            {
                bool IsAtleastOneNodeExisted = false;
                string LatestCameraIDInFile = "";
                string ConfigFilePath;
                
#if DEBUG
                ConfigFilePath = GlobalVariables.ConfigurationFilePath_Debug;
#else
                ConfigFilePath = GlobalVariables.ConfigurationFilePath_Release;
#endif
                if (File.Exists(ConfigFilePath))
                {
                    XmlDocument doc = new XmlDocument();
                    doc.Load(ConfigFilePath);
                    XmlNodeList elem = doc.GetElementsByTagName("Camera");
                    foreach (XmlNode tag in elem)
                    {
                        IsAtleastOneNodeExisted = true;
                         LatestCameraIDInFile = tag.Attributes["CameraID"].Value;

                        if (tag.Attributes["CameraIMSI"].Value== Camera.CameraIMSI) /* If Camera IMSI Already Exists */
                        {
                            
                            Response.responsecode = GlobalVariables.CameraIMSIAlreadyExists;
                            return Response;
                        }
                    }
                    if(IsAtleastOneNodeExisted)
                    {
                        if(LatestCameraIDInFile!="")
                        {
                            string Camera_number_part_str = LatestCameraIDInFile.Substring(LatestCameraIDInFile.Length - 3); // number part extracting from Cam ID;
                            int Camera_number_part_int = Convert.ToInt32(Camera_number_part_str);
                            Camera_number_part_int = Camera_number_part_int + 1;
                            Camera_number_part_str = Convert.ToString(Camera_number_part_int);
                            if(Camera_number_part_int<10)
                            {
                                Camera_number_part_str = "00" + Camera_number_part_str;
                            }
                            if(Camera_number_part_int>=10&&Camera_number_part_int<100)
                            {
                                Camera_number_part_str = "0" + Camera_number_part_str;
                            }
                            string CameraID = GlobalVariables.Camera_string + Camera_number_part_str;
                            XmlElement XEle = doc.CreateElement("Camera");
                            XEle.SetAttribute("CameraID", CameraID);
                            XEle.SetAttribute("CameraIMSI", Camera.CameraIMSI);
                            XEle.SetAttribute("Cameraname", Camera.CameraName);
                            XmlElement el = (XmlElement)doc.SelectSingleNode("Camdata");
                            if (el != null)
                            {
                                el.AppendChild(XEle); // Adding the Camera 
                                Response.CameraID = CameraID;
                                Response.responsecode = GlobalVariables.SuccessCode;
                            }
                        }
                    }
                    else
                    {
                        /* It IS First Camera to be Configured */
                        string CameraID = GlobalVariables.Camera_string+GlobalVariables.First_Camera_numberpart;
                        /* Add the Camera with this CameraID */
                        XmlElement XEle = doc.CreateElement("Camera");
                        XEle.SetAttribute("CameraID", CameraID);
                        XEle.SetAttribute("CameraIMSI", Camera.CameraIMSI);
                        XEle.SetAttribute("Cameraname", Camera.CameraName);
                        XmlElement el = (XmlElement)doc.SelectSingleNode("Camdata");
                        if(el!=null)
                        {
                            el.AppendChild(XEle); // Adding the Camera 
                            Response.CameraID = CameraID;
                            Response.responsecode = GlobalVariables.SuccessCode;
                        }
                    }
                    doc.Save(ConfigFilePath); // Saving the XML File 
                }
                else
                {
                    return null;    // To Return null when .XML file Not Exists 
                }

                return Response;
            }
            catch(Exception ex)
            {
                
                Response.responsecode= GlobalVariables.FailedToAddCamera;
                return Response;
            }
        }
        [WebMethod]
        [ScriptMethod]
        public static Responsecode UpdateCamera(CameraInfo Camera)
        {
            Responsecode Response = new Responsecode();
            try
            {
                string ConfigFilePath;
                bool IsNodeExisted = false;
#if DEBUG
                ConfigFilePath = GlobalVariables.ConfigurationFilePath_Debug;
#else
                ConfigFilePath = GlobalVariables.ConfigurationFilePath_Release;
#endif
                if (File.Exists(ConfigFilePath))
                {
                    XmlDocument doc = new XmlDocument();
                    doc.Load(ConfigFilePath);
                    XmlNodeList elem = doc.GetElementsByTagName("Camera");
                    foreach (XmlNode tag in elem)
                    {
                        if (tag.Attributes["CameraID"].Value == Camera.CameraID) /* If Camera IMSI Already Exists */
                        {
                            IsNodeExisted = true;
                            tag.Attributes["CameraIMSI"].Value = Camera.CameraIMSI;
                            tag.Attributes["Cameraname"].Value = Camera.CameraName;
                            break;
                        }
                    }
                    if(IsNodeExisted)
                    {
                        Response.responsecode = GlobalVariables.SuccessCode;
                    }
                    else
                    {
                        Response.responsecode = GlobalVariables.FailedToUpdateCamera;
                    }
                    doc.Save(ConfigFilePath);  // Save the XML file ...
                    return Response;
                }
                else
                {
                    return null;
                }
            }
            catch(Exception ex)
            {
                Response.responsecode = GlobalVariables.FailedToUpdateCamera;
                return Response;
            }
        }


        [WebMethod]
        [ScriptMethod]
        public static Responsecode DeleteCamera(CameraIDToDelete Camera)
        {
            Responsecode Response = new Responsecode();
            try
            {
                string ConfigFilePath;
                bool IsNodeExisted = false;
#if DEBUG
                ConfigFilePath = GlobalVariables.ConfigurationFilePath_Debug;
#else
                ConfigFilePath = GlobalVariables.ConfigurationFilePath_Release;
#endif
                if (File.Exists(ConfigFilePath))
                {
                    XmlDocument doc = new XmlDocument();
                    doc.Load(ConfigFilePath);
                    XmlNodeList elem = doc.GetElementsByTagName("Camera");
                    foreach (XmlNode tag in elem)
                    {
                        if (tag.Attributes["CameraID"].Value == Camera.CameraID) /* If Camera IMSI Already Exists */
                        {
                            IsNodeExisted = true;
                            tag.ParentNode.RemoveChild(tag); // Removing or Deleting this Tag ...
                            break;
                        }
                    }
                    doc.Save(ConfigFilePath);  // Save the XML file ...
                    if (IsNodeExisted)
                    {
                        Response.responsecode = GlobalVariables.SuccessCode;
                    }
                    else
                    {
                        Response.responsecode = GlobalVariables.FailedToDeleteCamera;
                    }
                    return Response;
               }
                else
                {
                    return null;
                }

                }
            catch(Exception  ex)
            {
                Response.responsecode = GlobalVariables.FailedToDeleteCamera;
                return Response;
            }
        }

}
    public class CameraIDToDelete
    {
        public string CameraID { get; set; }
    }
    public class CreateCameraResponsecode
    {
        public string CameraID { get; set; }
        public string responsecode { get; set; }
    }
    public class Responsecode
    {
        public string responsecode { get; set; }
    }
    public class Image_class
    {
        public string img_name { get; set; }
        public string img_path { get; set; }
    }
    public class Video_class
    {
        public string Video_name { get; set; }
        public string Video_path { get; set; }
        public string Videothumbnail_img_path { get; set; }
    }
    public class NewCamera
    {
        public string CameraName { get; set; }
        public string CameraIMSI { get; set; }
    }
    public class CameraInfo
    {
        public string CameraID { get; set; }
        public string CameraName { get; set; }
        public string CameraIMSI { get; set; }
    }
    public class timesInfo
    {
        public string fromdate;
        public string todate;
        public string Cam_no;
    }
    public class tmp_data
    {
        public string tmp_data_str;
    }
    /* Request Object related Classes Start */
    public class RequestObjectForCameras
    {
        public string fromdate { get; set; }
        public string todate { get; set; }
        public List<RequestCamObject> CamIMSI_arr = new List<RequestCamObject>();
    }
    public class RequestCamObject
    {
        public string CameraID { get; set; }
        public string IMSI { get; set; }
    }
    /* Request Object related Classes End */

    /* Response Object Related classes Start */
    public class Camera
    {
        public string Online_Sts { get; set; }
        public string IMSI { get; set; }
        public string CameraID { get; set; }
        public string LastSyncTime { get; set; }
        public List<Image_class> Images = new List<Image_class>();
        public List<Video_class> Videos = new List<Video_class>();
    }
    public class ALLCameras
    {
        public List<Camera> CameraList = new List<Camera>();
    }
    /* Response Object Related Classes End */

}