using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    public class DB : DbContext
    {
        public DB() : base("sqlserverdb") { }

        public DbSet<User> Users { get; set; }

        public DbSet<Channel> Channels { get; set; }

        public DbSet<Course> Courses { get; set; }

        public DbSet<EBook> EBooks { get; set; }

        public DbSet<File> Files { get; set; }

        public DbSet<Lession> Lessions { get; set; }

        public DbSet<News> News { get; set; }

        public DbSet<Note> Notes { get; set; }

        public DbSet<Question> Questions { get; set; }

        public DbSet<CourseQuestion> CourseQuestions { get; set; }

        public DbSet<ResourceLink> ResourceLinks { get; set; }

        public DbSet<TypeDictionary> TypeDictionaries { get; set; }

        public DbSet<Live> Lives { get; set; }

        public DbSet<LessionScore> LessionScores { set; get; }

        public DbSet<LearningRecord> LearningRecords { set; get; }

        public DbSet<StudyRecord> StudyRecords { set; get; }

        public DbSet<ReadRecord> ReadRecords { set; get; }

        public DbSet<UserCourse> UserCourses { set; get; }

        public DbSet<Menu> Menus { set; get; }

        public DbSet<Navigation> Navigations { set; get; }

        public DbSet<Viewpager> Viewpagers { set; get; }

        public DbSet<Joke> Jokes { set; get; }

        public DbSet<ITrial> ITrials { set; get; }

        public DbSet<Product> Products { set; get; }

        public DbSet<ProductFile> ProductFiles { set; get; }

        public DbSet<SpiderArticle> SpiderArticles { get; set; }

        public DbSet<ProductUserInfo> ProductUserInfos { set; get; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<File>().HasRequired(f => f.TypeDictionary).WithMany().WillCascadeOnDelete(false);
            modelBuilder.Entity<Course>().HasRequired(c => c.TypeDictionary).WithMany().WillCascadeOnDelete(false);
            modelBuilder.Entity<EBook>().HasRequired(e => e.TypeDictionary).WithMany().WillCascadeOnDelete(false);
            modelBuilder.Entity<News>().HasRequired(n => n.TypeDictionary).WithMany().WillCascadeOnDelete(false);
            modelBuilder.Entity<ResourceLink>().HasRequired(r => r.TypeDictionary).WithMany().WillCascadeOnDelete(false);

            modelBuilder.Entity<Note>().HasRequired(n => n.User).WithMany().WillCascadeOnDelete(false);
            modelBuilder.Entity<LessionScore>().HasRequired(ls => ls.User).WithMany().WillCascadeOnDelete(false);

            modelBuilder.Entity<StudyRecord>().HasRequired(ls => ls.User).WithMany().WillCascadeOnDelete(false);

            modelBuilder.Entity<LearningRecord>().HasRequired(ls => ls.User).WithMany().WillCascadeOnDelete(false);
            modelBuilder.Entity<ReadRecord>().HasRequired(ls => ls.User).WithMany().WillCascadeOnDelete(false);
            modelBuilder.Entity<UserCourse>().HasRequired(ls => ls.User).WithMany().WillCascadeOnDelete(false);
        }

    }
}