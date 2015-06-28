using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Data.SqlClient;
using System.Data;
using System.Globalization;
using System.Security.Cryptography;

namespace WpfApplication2
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        public int insert_type_id;
        public int type_id;
        public int user_id;
        private static string citizen_connStr;
        private static string qqhr_connStr ="Server='127.0.0.1';database='qqhrstudy';User ID='sa';Password='123456'";
        public MainWindow()
        {
            InitializeComponent();
            citizen_connStr = "Server='42.96.129.28';database='QqhrCitizen';User ID='sa';Password='koala19920716'";
            /*if (radiobt_1.IsChecked == true)
            {
                citizen_connStr = "Server='42.96.129.28';database='QqhrCitizen';User ID='sa';Password='koala19920716'";
            }
            else if (radiobt_2.IsChecked == true)
            {
                citizen_connStr = "Server='218.8.130.134';database='QqhrCitizen';User ID='sa';Password='Qqrtvu.com.cn!@#'";
            }
            else
            {
                MessageBox.Show("请选择");
            }*/
            user_id = Convert.ToInt32(Sqlhelp.ExecuteScalar("insert into Users (Username,Password,Age,SexAsInt,RoleAsInt,Score) values ('fanfzj','" + Md5("6yhn6yhn") + "','0','1','1','1');Select @@Identity",citizen_connStr));
            insert_type_id = Convert.ToInt32(Sqlhelp.ExecuteScalar("insert into TypeDictionaries (TypeValue,FatherID,Time,NeedAuthorize,Belonger) values ('其他','0','" + Convert.ToDateTime(DateTime.Now).ToString("yyyy-MM-dd HH:mm:ss.fff", DateTimeFormatInfo.InvariantInfo) + "','0','2')" + ";Select @@Identity",citizen_connStr));
            type_id = Convert.ToInt32(Sqlhelp.ExecuteScalar("insert into TypeDictionaries (TypeValue,FatherID,Time,NeedAuthorize,Belonger) values ('其他','" + insert_type_id + "','" + Convert.ToDateTime(DateTime.Now).ToString("yyyy-MM-dd HH:mm:ss.fff", DateTimeFormatInfo.InvariantInfo) + "','0','2')" + ";Select @@Identity",citizen_connStr));
        }
        public void SetNavigations()
        {

            Sqlhelp.ExecuteScalar("insert into Navigations (Title,Url,Nav_Id,Km_st_Id) values ('首页','/Home/Index','topmenu_home','Null')",citizen_connStr);
            Sqlhelp.ExecuteScalar("insert into Navigations (Title,Url,Nav_Id,Km_st_Id) values ('新闻','/News/Index','topmenu_news','Null')", citizen_connStr);
            Sqlhelp.ExecuteScalar("insert into Navigations (Title,Url,Nav_Id,Km_st_Id) values ('课程','/Course/Index','topmenu_course','d_row_course')", citizen_connStr);
            Sqlhelp.ExecuteScalar("insert into Navigations (Title,Url,Nav_Id,Km_st_Id) values ('电子书','/Ebook/Index','topmenu_ebook','d_row_ebook')", citizen_connStr);
            Sqlhelp.ExecuteScalar("insert into Navigations (Title,Url,Nav_Id,Km_st_Id) values ('直播','/Live/Index','topmenu_live','d_row_live')", citizen_connStr);
            Sqlhelp.ExecuteScalar("insert into Navigations (Title,Url,Nav_Id,Km_st_Id) values ('链接','Null','Null','d_row_link')", citizen_connStr);
            MessageBox.Show("成功");
        }
        public string Md5(string sDataIn)
        {
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();

            byte[] bytValue, bytHash;

            bytValue = System.Text.Encoding.UTF8.GetBytes(sDataIn);

            bytHash = md5.ComputeHash(bytValue);

            md5.Clear();

            string sTemp = "";

            for (int i = 0; i < bytHash.Length; i++)
            {

                sTemp += bytHash[i].ToString("X").PadLeft(2, '0');

            }

            return sTemp.ToLower();
        }
        private void Button_Click(object sender, RoutedEventArgs e)
        {
            ShowSqlNumber.Text = "";
            string qqhrstudy_sql = "select * from NewsInfo";
            string citizen_sql;
            DataTable citizen_sqldt = Sqlhelp.ExecuteDataTable(qqhrstudy_sql,qqhr_connStr);
            int a = 0;
            for (int i = 0; i < citizen_sqldt.Rows.Count; i++)
            {
                string Time = Convert.ToDateTime(citizen_sqldt.Rows[i]["CreatedTime"]).ToString("yyyy-MM-dd HH:mm:ss.fff", DateTimeFormatInfo.InvariantInfo);
                citizen_sql = "insert into News (Title,Content,FirstImgUrl,Time,UserID,Browses,NewsTypeID,IsHaveImg,IsWord) values (@Title,@Content,@FirstImgUrl,@Time,@UserID,@Browse,@NewsTypeID,@IshaveImg,@IsWord)";
                SqlParameter[] para = new SqlParameter[]
	                    {
                             new SqlParameter("@Title", SqlDbType.VarChar),
                             new SqlParameter("@Content",SqlDbType.VarChar),
                             new SqlParameter("@FirstImgUrl", SqlDbType.VarChar),
                             new SqlParameter("@Time",SqlDbType.DateTime),
                             new SqlParameter("@UserID", SqlDbType.Int),
                             new SqlParameter("@Browse",SqlDbType.Int),
                             new SqlParameter("@NewsTypeID", SqlDbType.Int),
                             new SqlParameter("@IshaveImg",SqlDbType.Int),
                             new SqlParameter("@IsWord",SqlDbType.Int)
                        };
                para[0].Value = citizen_sqldt.Rows[i]["Subject"].ToString();
                if (citizen_sqldt.Rows[i]["ImageFlag"].ToString() != "0")
                {
                    para[1].Value = "<img src='/" + citizen_sqldt.Rows[i]["ImageUrl"].ToString() + "'>" + citizen_sqldt.Rows[i]["MessageBody"].ToString();
                }
                else
                {
                    para[1].Value = citizen_sqldt.Rows[i]["MessageBody"].ToString();
                }
                para[2].Value = citizen_sqldt.Rows[i]["ImageUrl"].ToString();
                para[3].Value = Time;
                para[4].Value = user_id;
                para[5].Value = 0;
                para[6].Value = type_id;
                //para[6].Value = 37;
                para[7].Value = citizen_sqldt.Rows[i]["ImageFlag"].ToString();
                para[8].Value = 0;
                a += Sqlhelp.ExecuteNonQuery(citizen_sql,citizen_connStr, para);
                ShowSqlNumber.Text = ShowSqlNumber.Text + "<br>" + citizen_sql;
            }
            MessageBox.Show("导入数据：" + a.ToString());
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            ShowSqlNumber.Text = "";
            string qqhrstudy_sql = "select * from CourseInfo";
            string citizen_sql;
            DataTable citizen_sqldt = Sqlhelp.ExecuteDataTable(qqhrstudy_sql,qqhr_connStr);
            int a = 0;
            for (int i = 0; i < citizen_sqldt.Rows.Count; i++)
            {

                string Time = Convert.ToDateTime(citizen_sqldt.Rows[i]["CreatedTime"]).ToString("yyyy-MM-dd HH:mm:ss.fff", DateTimeFormatInfo.InvariantInfo);
                citizen_sql = "insert into Courses (Title,Description,AuthorityAsInt,Time,UserID,Browses,CourseTypeID,Credit) values (@Title,@Description,@AuthorityAsInt,@Time,@UserID,@Browse,@CourseTypeID,@Credit)";
                SqlParameter[] para = new SqlParameter[]
	                    {
                             new SqlParameter("@Title", SqlDbType.VarChar),
                             new SqlParameter("@Description",SqlDbType.VarChar),
                             new SqlParameter("@AuthorityAsInt", SqlDbType.Int),
                             new SqlParameter("@Time",SqlDbType.DateTime),
                             new SqlParameter("@UserID", SqlDbType.Int),
                             new SqlParameter("@Browse",SqlDbType.Int),
                             new SqlParameter("@CourseTypeID", SqlDbType.Int),
                             new SqlParameter("@Credit",SqlDbType.Int)
                        };
                para[0].Value = citizen_sqldt.Rows[i]["Name"].ToString();
                para[1].Value = citizen_sqldt.Rows[i]["Description"].ToString();
                para[2].Value = citizen_sqldt.Rows[i]["Status"].ToString();
                para[3].Value = Time;
                para[4].Value = user_id;
                para[5].Value = 0;
                para[6].Value = type_id;
                //para[6].Value = 37;
                para[7].Value = citizen_sqldt.Rows[i]["CreditHour"];
                int insert_id = Convert.ToInt32(Sqlhelp.ExecuteScalar(citizen_sql + ";Select @@Identity",citizen_connStr, para));
                string course_sql = "select * from CoursewareInfo where CourseId=" + citizen_sqldt.Rows[i]["Id"];
                DataTable coursest = Sqlhelp.ExecuteDataTable(course_sql,qqhr_connStr);
                if (coursest.Rows.Count > 0)
                {
                    //string insert_sql = "insert into Lessions (Title,Description,CourseID,Time,Remark,Path,Browses,IsPassTest) values ('" + coursest.Rows[0]["Name"] + "','" + coursest.Rows[0]["Name"] + "','" + insert_id + "','" + Convert.ToDateTime(coursest.Rows[0]["CreatedTime"]).ToString("yyyy-MM-dd HH:mm:ss.fff", DateTimeFormatInfo.InvariantInfo) + "','" + coursest.Rows[0]["Name"] + "','" + coursest.Rows[0]["Url"] + "','0','0')";
                    string insert_sql = "insert into Lessions (Title,Description,CourseID,Time,Remark,Path,Browses) values ('" + coursest.Rows[0]["Name"] + "','" + coursest.Rows[0]["Name"] + "','" + insert_id + "','" + Convert.ToDateTime(coursest.Rows[0]["CreatedTime"]).ToString("yyyy-MM-dd HH:mm:ss.fff", DateTimeFormatInfo.InvariantInfo) + "','" + coursest.Rows[0]["Name"] + "','" + coursest.Rows[0]["Url"] + "','0')";
                    Sqlhelp.ExecuteNonQuery(insert_sql,citizen_connStr);
                }
                a++;
                ShowSqlNumber.Text = ShowSqlNumber.Text + "<br>" + course_sql;
            }
            MessageBox.Show("导入数据：" + a.ToString());
        }
        private void Button_Click_2(object sender, RoutedEventArgs e)
        {
            SetNavigations();
        }
    }
}
