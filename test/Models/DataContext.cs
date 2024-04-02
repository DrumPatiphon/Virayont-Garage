using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Dynamic;
using System.Runtime.InteropServices.ObjectiveC;

namespace test.Models
{
  public class DataContext : DbContext
  {
    protected readonly IConfiguration Configuration;

    public DataContext(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
      options.UseNpgsql(Configuration.GetConnectionString("WebApiDatabase"));
    }

    //public async Task<IEnumerable<dynamic>> QueryAsync(string sql)
    //{
    //  using (var command = Database.GetDbConnection().CreateCommand())
    //  {
    //    command.CommandText = sql;
    //    command.CommandType = System.Data.CommandType.Text;

    //    await Database.OpenConnectionAsync();

    //    using (var result = await command.ExecuteReaderAsync())
    //    {
    //      var entities = new List<dynamic>();
    //      while (await result.ReadAsync())
    //      {
    //        var entity = new ExpandoObject() as IDictionary<string, object>;
    //        for (var i = 0; i < result.FieldCount; i++)
    //        {
    //          entity.Add(result.GetName(i), result[i]);
    //        }
    //        entities.Add(entity);
    //      }
    //      return entities;
    //    }
    //  }
    //}

    //private DbSet<T> Set<T>() where T : class;
    public DbSet<Customer> customer { get; set; }
    public DbSet<Employee> employee { get; set; }
    public DbSet<Spare_part> spare_part { get; set; }
    public DbSet<Department> department { get; set; }
    public DbSet<Spare4Task> Spare4Task { get; set; }
    public DbSet<Spare_type> spare_type { get; set; }
    public DbSet<Dbtask> dbtask { get; set; }
    public DbSet<Vehicle> vehicle { get; set; }

    public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object parameters, CancellationToken cancellationToken = default)
    {
      using (var command = CreateCommand(sql, parameters))
      {
        return await ExecuteQueryAsync<T>(command, cancellationToken);
      }
    }

    private DbCommand CreateCommand(string sql, object parameters)
    {
      var connection = GetConnection();
      var command = connection.CreateCommand();
      command.CommandText = sql;
      if (parameters != null)
      {
        foreach (var property in parameters.GetType().GetProperties())
        {
          var parameter = command.CreateParameter();
          parameter.ParameterName = "@" + property.Name;
          parameter.Value = property.GetValue(parameters) ?? DBNull.Value;
          command.Parameters.Add(parameter);
        }
      }
      return command;
    }

    private async Task<IEnumerable<T>> ExecuteQueryAsync<T>(DbCommand command, CancellationToken cancellationToken)
    {
      var result = new List<T>();
      await OpenConnectionAsync(cancellationToken);
      using (var reader = await command.ExecuteReaderAsync(cancellationToken))
      {
        while (await reader.ReadAsync(cancellationToken))
        {
          var obj = Activator.CreateInstance<T>();
          for (var i = 0; i < reader.FieldCount; i++)
          {
            var propertyName = reader.GetName(i);
            var property = typeof(T).GetProperty(propertyName);
            if (property != null && !reader.IsDBNull(i))
            {
              property.SetValue(obj, reader.GetValue(i));
            }
          }
          result.Add(obj);
        }
      }
      return result;
    }

    private DbConnection GetConnection()
    {
      var connection = Database.GetDbConnection();
      if (connection.State != ConnectionState.Open)
      {
        connection.Open();
      }
      return connection;
    }

    private async Task OpenConnectionAsync(CancellationToken cancellationToken)
    {
      var connection = Database.GetDbConnection();
      if (connection.State != ConnectionState.Open)
      {
        await connection.OpenAsync(cancellationToken);
      }
    }
  }
}
