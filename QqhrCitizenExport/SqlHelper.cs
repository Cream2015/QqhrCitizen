using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QqhrCitizenExport
{
    public class SqlHelper
    {
        private static SqlConnection conn;
        private static string strConn = ConfigurationManager.ConnectionStrings["mysqlsqerver"].ToString();
        public static SqlConnection GetConn()
        {
            if (conn == null)
            {
                conn = new SqlConnection(strConn);
                if (conn.State != ConnectionState.Open)
                {
                    conn.Open();
                }
            }
            return conn;
        }
        /// <summary>
        /// 执行不带参数的sql语句或者存储过程
        /// </summary>
        /// <param name="strSql">Sql语句或者存储过程</param>
        /// <param name="ct">类型</param>
        /// <returns></returns>
        public static int ExecuteSql(string strSql, CommandType ct)
        {
            int res = 0; ;
            using (SqlCommand cmd = new SqlCommand(strSql, GetConn()))
            {
                cmd.CommandText = strSql;
                cmd.CommandType = ct;
                try
                {
                    res = cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
            return res;
        }
        /// <summary>
        /// 执行带参数的Sql语句或者存储过程
        /// </summary>
        /// <param name="strSql"></param>
        /// <param name="ct"></param>
        /// <param name="paras"></param>
        /// <returns></returns>
        public static int ExecuteSql(string strSql, CommandType ct, SqlParameter[] paras)
        {
            int res = 0; ;
            using (SqlCommand cmd = new SqlCommand(strSql, GetConn()))
            {
                cmd.CommandText = strSql;
                cmd.CommandType = ct;
                if (paras != null)
                {
                    foreach (SqlParameter para in paras)
                    {

                        cmd.Parameters.Add(para);
                    }
                }

                try
                {
                    res = cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
            return res;
        }
        /// <summary>
        /// 执行不带参数的查询语句或存储过程
        /// </summary>
        /// <param name="strSql">要执行的Sql语句或存储过程</param>
        /// <param name="ct">sql语句或存储过程的类型</param>
        /// <returns></returns>
        public static DataSet ExecuteSqlDataSet(string strSql, CommandType ct)
        {
            DataSet ds = new DataSet();
            using (SqlCommand cmd = new SqlCommand(strSql, GetConn()))
            {
                cmd.CommandType = ct;
                cmd.CommandText = strSql;
                using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                {
                    sda.Fill(ds);
                }
            }
            return ds;
        }
        /// <summary>
        /// 执行带参数的sql语句或存储过程
        /// </summary>
        /// <param name="strSql">要执行的Sql语句或存储过程</param>
        /// <param name="ct">sql语句或存储过程的类型</param>
        /// <param name="paras">参数集合</param>
        /// <returns></returns>
        public static DataSet ExecuteSqlDataSet(string strSql, CommandType ct, SqlParameter[] paras)
        {
            DataSet ds = new DataSet();
            using (SqlCommand cmd = new SqlCommand(strSql, GetConn()))
            {
                cmd.CommandType = ct;
                cmd.CommandText = strSql;
                if (paras != null)
                {
                    foreach (SqlParameter para in paras)
                    {

                        cmd.Parameters.Add(para);
                    }
                }
                using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                {
                    sda.Fill(ds);
                }
            }
            return ds;
        }
    }
}
