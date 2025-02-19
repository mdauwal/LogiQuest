
import { DataSource } from 'typeorm';  //   DataSource Import helps to interact with the database
import { Chain } from '../../src/chain/entities/chain.entity';  // Import the Chain entity to reference the chains table

// An async function to seed the database
export async function seedChains(dataSource: DataSource) {
  
  const repository = dataSource.getRepository(Chain); // setting the repository to interact with the Chain table

  // using predefined test data into the Chain table
  await repository.insert([
    { id: 1, name: 'Stark' },  
    { id: 2, name: 'Pi' },     
  ]);
}
