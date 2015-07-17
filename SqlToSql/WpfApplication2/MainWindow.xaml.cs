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
using System.Threading;
using System.Net;
using System.IO;

namespace WpfApplication2
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {

        public delegate void UpdateTextCallback(string message);
        private static string radio_1 = "Server='42.96.129.28';database='QqhrCitizen';User ID='sa';Password='koala19920716'";
        private static string radio_2 = "Server='218.8.130.134';database='QqhrCitizen';User ID='sa';Password='Qqrtvu.com.cn!@#'";
        private static string qqhr_connStr = "Server='127.0.0.1';database='qqhrstudy';User ID='sa';Password='123456'";
        public MainWindow()
        {
            InitializeComponent();
        }

        public void ShowText(string message)
        {

            ShowSqlNumber.Text = message;

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
        public void insert_new(int user_id, string citizen_connStr, int type_id)
        {
            string qqhrstudy_sql = "select * from NewsInfo";
            string citizen_sql;
            DataTable citizen_sqldt = Sqlhelp.ExecuteDataTable(qqhrstudy_sql, qqhr_connStr);
            int a = 0;
            for (int i = 0; i < citizen_sqldt.Rows.Count; i++)
            {
                string Time = Convert.ToDateTime(citizen_sqldt.Rows[i]["CreatedTime"]).ToString("yyyy-MM-dd HH:mm:ss.fff", DateTimeFormatInfo.InvariantInfo);
                citizen_sql = "insert into News (Title,Content,FirstImgUrl,Time,UserID,Browses,NewsTypeID,IsHaveImg,IsWord,PlaceAsInt) values (@Title,@Content,@FirstImgUrl,@Time,@UserID,@Browse,@NewsTypeID,@IshaveImg,@IsWord,@Place)";
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
                             new SqlParameter("@IsWord",SqlDbType.Int),
                             new SqlParameter("@Place",SqlDbType.Int)
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
                para[9].Value = 0;
                a += Sqlhelp.ExecuteNonQuery(citizen_sql, citizen_connStr, para);
                ShowSqlNumber.Dispatcher.Invoke(new UpdateTextCallback(this.ShowText),
                new object[] { citizen_sql });
            }
            MessageBox.Show("导入数据：" + a.ToString());


        }
        #region 新闻
        private void Button_Click(object sender, RoutedEventArgs e)
        {
            if ((radiobt_1.IsChecked == true) || (radiobt_2.IsChecked == true))
            {
                int user_id = Convert.ToInt32(txtuser.Text.ToString());
                string citizen_connStr = radiobt_1.IsChecked == true ? radio_1 : radio_2;
                int type_id = Convert.ToInt32(txt_type.Text.ToString());
                ThreadStart start = delegate { insert_new(user_id, citizen_connStr, type_id); };
                Thread test = new Thread(new ThreadStart(start));
                test.Start();
            }
            else
            {
                MessageBox.Show("请选择数据库");
            }
        }
        #endregion
        int sum = 0;
        #region 课程
        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            if ((radiobt_1.IsChecked == true) || (radiobt_2.IsChecked == true))
            {
                MessageBox.Show("开始");
                int user_id = Convert.ToInt32(txtuser.Text.ToString());
                string citizen_connStr = radiobt_1.IsChecked == true ? radio_1 : radio_2;
                int type_id = Convert.ToInt32(txt_type.Text.ToString());
                ThreadStart starter = delegate { insert_course(user_id, citizen_connStr, type_id); };
                Thread test = new Thread(new ThreadStart(starter));
                test.Start();
            }
            else
            {
                MessageBox.Show("请选择数据库");
            }
        }
        public void insert_course(int user_id, string citizen_connStr, int type_id)
        {
            string sql1 = "select * from CourseCategoryInfo where ParentId=0";
            string sql2, sql3, sql4;
            string insert_sql1, insert_sql2, insert_sql3, insert_sql4;
            DataTable cit_sql1 = Sqlhelp.ExecuteDataTable(sql1, qqhr_connStr);
            DataTable cit_sql2, cit_sql3, cit_sql4;

            int insert_id1 = 0, insert_id2 = 0, insert_id3 = 0, insert_id4 = 0;
            string Time1, Time2, Time3, Time4;
            if (cit_sql1 != null)
            {
                for (int a = 0; a < cit_sql1.Rows.Count; a++)
                {
                    sql2 = "select * from CourseCategoryInfo where ParentId=" + cit_sql1.Rows[a]["Id"];
                    cit_sql2 = Sqlhelp.ExecuteDataTable(sql2, qqhr_connStr);
                    Time1 = SetDateTime(cit_sql1.Rows[a]["CreatedTime"]);

                    insert_sql1 = "insert into TypeDictionaries (TypeValue,Time,NeedAuthorize,Belonger,FatherID) values('" + cit_sql1.Rows[a]["Name"] + "','" + Time1 + "','0','4','0');Select @@Identity";
                    ShowSqlNumber.Dispatcher.Invoke(new UpdateTextCallback(this.ShowText),
                new object[] { insert_sql1 });
                    sum++;
                    insert_id1 = Convert.ToInt32(Sqlhelp.ExecuteScalar(insert_sql1, citizen_connStr));
                    Insert_Course(cit_sql1.Rows[a]["Id"], insert_id1, user_id, citizen_connStr);
                    if (cit_sql2 != null)
                    {
                        for (int b = 0; b < cit_sql2.Rows.Count; b++)
                        {


                            sql3 = "select * from CourseCategoryInfo where ParentId=" + cit_sql2.Rows[b]["Id"];
                            cit_sql3 = Sqlhelp.ExecuteDataTable(sql3, qqhr_connStr);
                            Time2 = SetDateTime(cit_sql2.Rows[b]["CreatedTime"]);

                            insert_sql2 = "insert into TypeDictionaries (TypeValue,Time,NeedAuthorize,Belonger,FatherID) values('" + cit_sql2.Rows[b]["Name"] + "','" + Time2 + "','0','4','" + insert_id1 + "');Select @@Identity";
                            ShowSqlNumber.Dispatcher.Invoke(new UpdateTextCallback(this.ShowText),
                new object[] { insert_sql2 });
                            sum++;
                            insert_id2 = Convert.ToInt32(Sqlhelp.ExecuteScalar(insert_sql2, citizen_connStr));
                            Insert_Course(cit_sql2.Rows[b]["Id"], insert_id2, user_id, citizen_connStr);
                            if (cit_sql3 != null)
                            {
                                for (int c = 0; c < cit_sql3.Rows.Count; c++)
                                {
                                    sql4 = "select * from CourseCategoryInfo where ParentId=" + cit_sql3.Rows[c]["Id"];
                                    cit_sql4 = Sqlhelp.ExecuteDataTable(sql4, qqhr_connStr);
                                    Time3 = SetDateTime(cit_sql3.Rows[c]["CreatedTime"]);

                                    insert_sql3 = "insert into TypeDictionaries (TypeValue,Time,NeedAuthorize,Belonger,FatherID) values('" + cit_sql3.Rows[c]["Name"] + "','" + Time3 + "','0','4','" + insert_id2 + "');Select @@Identity";
                                    ShowSqlNumber.Dispatcher.Invoke(new UpdateTextCallback(this.ShowText),
                new object[] { insert_sql3 });
                                    sum++;
                                    insert_id3 = Convert.ToInt32(Sqlhelp.ExecuteScalar(insert_sql3, citizen_connStr));
                                    Insert_Course(cit_sql3.Rows[c]["Id"], insert_id3, user_id, citizen_connStr);
                                    if (cit_sql4 != null)
                                    {
                                        for (int d = 0; d < cit_sql4.Rows.Count; d++)
                                        {
                                            Time4 = SetDateTime(cit_sql4.Rows[d]["CreatedTime"]);
                                            insert_sql4 = "insert into TypeDictionaries (TypeValue,Time,NeedAuthorize,Belonger,FatherID) values('" + cit_sql4.Rows[d]["Name"] + "','" + Time4 + "','0','4','" + insert_id3 + "');Select @@Identity";
                                            ShowSqlNumber.Dispatcher.Invoke(new UpdateTextCallback(this.ShowText),
                new object[] { insert_sql4 });
                                            sum++;
                                            insert_id4 = Convert.ToInt32(Sqlhelp.ExecuteScalar(insert_sql4, citizen_connStr));
                                            Insert_Course(cit_sql4.Rows[d]["Id"], insert_id4, user_id, citizen_connStr);
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }
            MessageBox.Show("导入数据：" + sum.ToString());

        }
        private int Insert_Course(object select_course_id, int insert_course_id, int users_id, string citizen_connStr)
        {
            string Time, insert_sql5, insert_sql6, Time_Course, Url;
            int inset_id_course = 0;
            DataTable cit_sql6;
            DataTable cit_sql5 = Sqlhelp.ExecuteDataTable("select * from CourseInfo where CourseCategoryId=" + Convert.ToInt32(select_course_id), qqhr_connStr);
            for (int f = 0; f < cit_sql5.Rows.Count; f++)
            {
                Time = SetDateTime(cit_sql5.Rows[f]["CreatedTime"]);
                insert_sql5 = "insert into Courses (CourseTypeID,Title,Description,UserID,Time,AuthorityAsInt,Browses,Credit) values ('" + insert_course_id + "','" + cit_sql5.Rows[f]["Name"] + "','" + cit_sql5.Rows[f]["Description"] + "','" + users_id + "','" + Time + "','0','0','" + Convert.ToInt32(cit_sql5.Rows[f]["CreditHour"]) + "');Select @@Identity";
                ShowSqlNumber.Dispatcher.Invoke(new UpdateTextCallback(this.ShowText),
                    new object[] { insert_sql5 });
                sum++;
                inset_id_course = Convert.ToInt32(Sqlhelp.ExecuteScalar(insert_sql5, citizen_connStr));
                cit_sql6 = Sqlhelp.ExecuteDataTable("select * from CoursewareInfo where CourseId=" + cit_sql5.Rows[f]["Id"], qqhr_connStr);
                for (int g = 0; g < cit_sql6.Rows.Count; g++)
                {
                    Time_Course = SetDateTime(cit_sql6.Rows[g]["CreatedTime"]);
                    Url = cit_sql6.Rows[g]["Url"].ToString();
                    Url = Url.Replace("http://218.8.130.135/终身学习", "http://218.8.130.135:8000");
                    insert_sql6 = "insert into Lessions (Title,Description,CourseID,Time,Path,Browses) values ('" + cit_sql6.Rows[g]["Name"] + "','" + cit_sql6.Rows[g]["Name"] + "','" + inset_id_course + "','" + Time_Course + "','" + Url + "','0')";
                    ShowSqlNumber.Dispatcher.Invoke(new UpdateTextCallback(this.ShowText),
                    new object[] { insert_sql6 });
                    Sqlhelp.ExecuteScalar(insert_sql6, citizen_connStr);
                    sum++;
                    if ((sum + 1) % 1000 == 0)
                    {
                        System.Threading.Thread.Sleep(5000);
                        MessageBox.Show("再次开始");
                    }
                }
            }
            return 1;
        }
        #endregion

        private string SetDateTime(object time)
        {
            return Convert.ToDateTime(time).ToString("yyyy-MM-dd HH:mm:ss.fff", DateTimeFormatInfo.InvariantInfo);
        }
        private void Button_Click_2(object sender, RoutedEventArgs e)
        {
            if (radiobt_1.IsChecked == true || radiobt_2.IsChecked == true)
            {
                string citizen_connStr = radiobt_1.IsChecked == true ? radio_1 : radio_2;
                ThreadStart start = delegate { insert_SetNavigations(citizen_connStr); };
                Thread test = new Thread(new ThreadStart(start));
                test.Start();
            }
            else
            {
                MessageBox.Show("请选择数据库");
            }
        }
        public void insert_SetNavigations(string citizen_connStr)
        {
            Sqlhelp.ExecuteScalar("insert into Navigations (Title,Url,Nav_Id,Km_st_Id) values ('首页','/Home/Index','topmenu_home','Null')", citizen_connStr);
            Sqlhelp.ExecuteScalar("insert into Navigations (Title,Url,Nav_Id,Km_st_Id) values ('新闻','/News/Index','topmenu_news','Null')", citizen_connStr);
            Sqlhelp.ExecuteScalar("insert into Navigations (Title,Url,Nav_Id,Km_st_Id) values ('课程','/Course/Index','topmenu_course','d_row_course')", citizen_connStr);
            Sqlhelp.ExecuteScalar("insert into Navigations (Title,Url,Nav_Id,Km_st_Id) values ('电子书','/Ebook/Index','topmenu_ebook','d_row_ebook')", citizen_connStr);
            Sqlhelp.ExecuteScalar("insert into Navigations (Title,Url,Nav_Id,Km_st_Id) values ('直播','/Live/Index','topmenu_live','d_row_live')", citizen_connStr);
            Sqlhelp.ExecuteScalar("insert into Navigations (Title,Url,Nav_Id,Km_st_Id) values ('链接','Null','Null','d_row_link')", citizen_connStr);
            MessageBox.Show("成功");
        }

        private void Button_Click_3(object sender, RoutedEventArgs e)
        {
            if (radiobt_1.IsChecked == true || radiobt_2.IsChecked == true)
            {
                string citizen_connStr = radiobt_1.IsChecked == true ? radio_1 : radio_2;
                string a = Convert.ToInt32(Sqlhelp.ExecuteScalar("insert into Users (Username,password,Age,SexAsInt,RoleAsInt,Score) values ('fanfzj','" + Md5("6yhn6yhn") + "','20','1','1','1000');Select @@Identity", citizen_connStr)).ToString();
                MessageBox.Show("成功");
                txtuser.Text = a;
            }
            else
            {
                MessageBox.Show("请选择数据库");
            }
        }

        private void Button_Click_4(object sender, RoutedEventArgs e)
        {
            string PageUrl = UrlText.Text;
            WebRequest request = WebRequest.Create(PageUrl);
            WebResponse response = request.GetResponse();
            Stream resStream = response.GetResponseStream();
            StreamReader sr = new StreamReader(resStream, System.Text.Encoding.Default);
            ShowSqlNumber.Text = sr.ReadToEnd();
            resStream.Close();
            sr.Close();
        }

        private void Button_Click_5(object sender, RoutedEventArgs e)
        {
            if (radiobt_1.IsChecked == true || radiobt_2.IsChecked == true)
            {
                string citizen_connStr = radiobt_1.IsChecked == true ? radio_1 : radio_2;
                int insert_type_id = Convert.ToInt32(Sqlhelp.ExecuteScalar("insert into TypeDictionaries (TypeValue,FatherID,Time,NeedAuthorize,Belonger) values ('其他新闻','0','" + Convert.ToDateTime(DateTime.Now).ToString("yyyy-MM-dd HH:mm:ss.fff", DateTimeFormatInfo.InvariantInfo) + "','0','2')" + ";Select @@Identity", citizen_connStr));
                int type_id = Convert.ToInt32(Sqlhelp.ExecuteScalar("insert into TypeDictionaries (TypeValue,FatherID,Time,NeedAuthorize,Belonger) values ('其他','" + insert_type_id + "','" + Convert.ToDateTime(DateTime.Now).ToString("yyyy-MM-dd HH:mm:ss.fff", DateTimeFormatInfo.InvariantInfo) + "','0','2')" + ";Select @@Identity", citizen_connStr));
                MessageBox.Show("成功");
                txt_type.Text = type_id.ToString();
            }
            else
            {
                MessageBox.Show("请选择数据库");
            }
        }

        private void Button_Click_6(object sender, RoutedEventArgs e)
        {
            if (radiobt_1.IsChecked == true || radiobt_2.IsChecked == true)
            {
                int user_id = Convert.ToInt32(txtuser.Text.ToString());
                int father_id=Convert.ToInt32(txt_type.Text.ToString());
                string citizen_connStr = radiobt_1.IsChecked == true ? radio_1 : radio_2;
                ThreadStart start = delegate { insert_Repository(user_id, citizen_connStr,father_id); };
                Thread test = new Thread(new ThreadStart(start));
                test.Start();
            }
            else
            {
                MessageBox.Show("请选择数据库");
            }
        }
        private void insert_Repository(int user_id, string citizen_connStr, int FantherID)
        {
            string Time, insert_sql5, insert_sql6, insert_sql7, Time_Course, Url;
            int inset_id_course = 0, inset_id_type;
            DataTable cit_sql6;
            DataTable cit_sql5 = Sqlhelp.ExecuteDataTable("select * from RepositoryCategoryInfo", qqhr_connStr);
            for (int f = 0; f < cit_sql5.Rows.Count; f++)
            {
                Time = SetDateTime(cit_sql5.Rows[f]["CreatedTime"]);
                insert_sql5 = "insert into TypeDictionaries (TypeValue,Time,NeedAuthorize,Belonger,FatherID) values ('" + cit_sql5.Rows[f]["Name"] + "','" + Time + "','0','4','" + FantherID + "');Select @@Identity";
                ShowSqlNumber.Dispatcher.Invoke(new UpdateTextCallback(this.ShowText),
                    new object[] { insert_sql5 });
                sum++;
                inset_id_type = Convert.ToInt32(Sqlhelp.ExecuteScalar(insert_sql5, citizen_connStr));
                cit_sql6 = Sqlhelp.ExecuteDataTable("select * from RepositoryInfo where RepositoryCategoryId=" + cit_sql5.Rows[f]["Id"], qqhr_connStr);
                insert_sql6 = "insert into Courses (CourseTypeID,Title,Description,UserID,Time,Browses,Credit) values ('" + inset_id_type + "','" + cit_sql5.Rows[f]["Name"] + "','" + cit_sql5.Rows[f]["Name"] + "','" + user_id + "','" + Time + "','0','0');Select @@Identity";
                ShowSqlNumber.Dispatcher.Invoke(new UpdateTextCallback(this.ShowText),
                    new object[] { insert_sql6 });
                sum++;
                inset_id_course = Convert.ToInt32(Sqlhelp.ExecuteScalar(insert_sql6, citizen_connStr));
                for (int g = 0; g < cit_sql6.Rows.Count; g++)
                {
                    Time_Course = SetDateTime(cit_sql6.Rows[g]["CreatedTime"]);
                    Url = cit_sql6.Rows[g]["Url"].ToString();
                    Url = Url.Replace("http://218.8.130.135/终身学习", "http://218.8.130.135:8000");
                    insert_sql7 = "insert into Lessions (Title,Description,CourseID,Time,Path,Browses) values ('" + cit_sql6.Rows[g]["Name"] + "','" + cit_sql5.Rows[f]["Name"] + "——" + cit_sql6.Rows[g]["Name"] + "','" + inset_id_course + "','" + Time_Course + "','" + Url + "','0')";
                    ShowSqlNumber.Dispatcher.Invoke(new UpdateTextCallback(this.ShowText),
                    new object[] { insert_sql7 });
                    Sqlhelp.ExecuteScalar(insert_sql7, citizen_connStr);
                    sum++;
                    if ((sum + 1) % 1000 == 0)
                    {
                        System.Threading.Thread.Sleep(5000);
                        MessageBox.Show("再次开始");
                    }
                }
            }
            MessageBox.Show("总导入数据：" + sum);
        }

    }
}
