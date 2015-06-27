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

namespace WpfApplication2 
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            Sql_list.Items.Clear();
            string qqhrstudy_sql = "select * from NewsInfo";
            string citizen_sql;
            DataTable citizen_sqldt = qqhr_sqlhelp.ExecuteDataTable(qqhrstudy_sql);
            int a = 0;
            for (int i = 0; i < citizen_sqldt.Rows.Count; i++)
            {
                string Time = Convert.ToDateTime(citizen_sqldt.Rows[i]["CreatedTime"]).ToString("yyyy-MM-dd HH:mm:ss.fff", DateTimeFormatInfo.InvariantInfo);
                citizen_sql = "insert into News (Title,Content,FirstImgUrl,Time,UserID,Browses,NewsTypeID,IsHaveImg) values (@Title,@Content,@FirstImgUrl,@Time,@UserID,@Browse,@NewsTypeID,@IshaveImg)";
                SqlParameter[] para = new SqlParameter[]
	                    {
                             new SqlParameter("@Title", SqlDbType.VarChar),
                             new SqlParameter("@Content",SqlDbType.VarChar),
                             new SqlParameter("@FirstImgUrl", SqlDbType.VarChar),
                             new SqlParameter("@Time",SqlDbType.DateTime),
                             new SqlParameter("@UserID", SqlDbType.Int),
                             new SqlParameter("@Browse",SqlDbType.Int),
                             new SqlParameter("@NewsTypeID", SqlDbType.Int),
                             new SqlParameter("@IshaveImg",SqlDbType.Int)
                        };
                para[0].Value = citizen_sqldt.Rows[i]["Subject"].ToString();
                if (citizen_sqldt.Rows[i]["ImageFlag"].ToString()!="0")
                {
                    para[1].Value = "<img src='/" + citizen_sqldt.Rows[i]["ImageUrl"].ToString() + "'>" + citizen_sqldt.Rows[i]["MessageBody"].ToString();
                }
                else
                {
                    para[1].Value = citizen_sqldt.Rows[i]["MessageBody"].ToString();
                }
                para[2].Value = citizen_sqldt.Rows[i]["ImageUrl"].ToString();
                para[3].Value = Time;
                para[4].Value = 1;
                para[5].Value = 0;
                para[6].Value = 37;
                para[7].Value = citizen_sqldt.Rows[i]["ImageFlag"].ToString();
                a += citizen_sqlhelp.ExecuteNonQuery(citizen_sql,para);
                Sql_list.Items.Add(citizen_sql);
            }
            MessageBox.Show("导入数据："+a.ToString());
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            Sql_list.Items.Clear();
            string qqhrstudy_sql = "select * from CourseInfo";
            string citizen_sql;
            DataTable citizen_sqldt = qqhr_sqlhelp.ExecuteDataTable(qqhrstudy_sql);
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
                para[4].Value = 1;
                para[5].Value = 0;
                para[6].Value = 37;
                para[7].Value = 6;
                a += citizen_sqlhelp.ExecuteNonQuery(citizen_sql, para);
                Sql_list.Items.Add(citizen_sql);
            }
            MessageBox.Show("导入数据：" + a.ToString());
        }
    }
}
