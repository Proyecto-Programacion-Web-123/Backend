/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('products').del();

  // Inserts seed entries
  await knex('products').insert([
    {
      name: 'Doom Eternal',
      description: 'Rip and tear through hell’s fiercest demons.',
      price: 399.00,
      image_url: '/img/ilustracion2.png',
      release_date: '2020-03-20'
    },
    {
      name: 'Space Marine 2',
      description: 'Crush Tyranids in brutal Warhammer 40K battles.',
      price: 530.00,
      image_url: '/img/spacemarin.png',
      release_date: '2024-09-09'
    },
    {
      name: 'Silent Hill 2 Remake',
      description: 'Face your past in a haunting nightmare.',
      price: 270.00,
      image_url: '/img/silenthill.png',
      release_date: '2023-10-10'
    },
    {
      name: 'Killing Floor 3',
      description: 'Survive waves of horrors with firepower.',
      price: 305.00,
      image_url: '/img/killingfloor.png',
      release_date: '2024-05-05'
    }
  ]);
};
