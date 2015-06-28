using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;

namespace WpfApplication2
{
    class citizen_sqlhelp
    {
        private static string connStr = "Server='42.96.129.28';database='QqhrCitizen';User ID='sa';Password='koala19920716'";
        // private static string connStr = "Server='218.8.130.134';database='QqhrCitizen';User ID='sa';Password='Qqrtvu.com.cn!@#'";
        public static int ExecuteNonQuery(string sql, params SqlParameter[] parameters)
        {

            using (SqlConnection conn = new SqlConnection(connStr))
            {

                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {

                    cmd.CommandText = sql;

                    //foreach (SqlParameter param in parameters)

                    //{

                    //    cmd.Parameters.Add(param);

                    //}

                    cmd.Parameters.AddRange(parameters);

                    return cmd.ExecuteNonQuery();

                }

            }

        }

        public static object ExecuteScalar(string sql, params SqlParameter[] parameters)
        {

            using (SqlConnection conn = new SqlConnection(connStr))
            {

                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {

                    cmd.CommandText = sql;

                    cmd.Parameters.AddRange(parameters);

                    return cmd.ExecuteScalar();

                }

            }

        }
        //只用来执行查询结果比较小的sql
        public static DataSet ExecuteDataSet(string sql)
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = sql;
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    DataSet dataset = new DataSet();
                    adapter.Fill(dataset);
                    return dataset;
                }

            }
        }
        //只用来执行查询结果比较少的sql

        public static DataTable ExecuteDataTable(string sql, params SqlParameter[] parameters)
        {

            using (SqlConnection conn = new SqlConnection(connStr))
            {

                conn.Open();

                using (SqlCommand cmd = conn.CreateCommand())
                {

                    cmd.CommandText = sql;

                    cmd.Parameters.AddRange(parameters);

                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);

                    DataSet dataset = new DataSet();

                    adapter.Fill(dataset);

                    return dataset.Tables[0];

                }

            }
        }
    }
}
