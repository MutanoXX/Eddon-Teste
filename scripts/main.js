import { world, system, ItemStack } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';

// Créditos: MutanoX
const ADDON_BOOK_ID = 'minecraft:written_book';
const EFFECTS_DATA = 'visualEffects:playerEffect';

// 10 Efeitos Visuais
const VISUAL_EFFECTS = {
  fire_pentagram: {
    name: '§cPentagrama de Fogo',
    particle: 'minecraft:basic_flame_particle',
    description: 'Pentagrama de fogo aos seus pés'
  },
  ice_aura: {
    name: '§bAura de Gelo',
    particle: 'minecraft:ice_vapor_particle',
    description: 'Aura congelante ao redor'
  },
  soul_spiral: {
    name: '§3Espiral de Almas',
    particle: 'minecraft:soul_particle',
    description: 'Espiral de almas subindo'
  },
  electric_ring: {
    name: '§eAnel Elétrico',
    particle: 'minecraft:electric_spark_particle',
    description: 'Anel elétrico girando'
  },
  nature_bloom: {
    name: '§aFlorescer Natural',
    particle: 'minecraft:crop_growth_emitter',
    description: 'Flores crescendo ao redor'
  },
  void_portal: {
    name: '§5Portal do Vazio',
    particle: 'minecraft:portal_directional',
    description: 'Portal dimensional aos pés'
  },
  dragon_breath: {
    name: '§dSopro do Dragão',
    particle: 'minecraft:dragon_breath_trail',
    description: 'Trilha de sopro dracônico'
  },
  holy_light: {
    name: '§6Luz Sagrada',
    particle: 'minecraft:totem_particle',
    description: 'Luz divina envolvente'
  },
  dark_smoke: {
    name: '§8Fumaça Sombria',
    particle: 'minecraft:large_smoke_particle',
    description: 'Fumaça negra ao redor'
  },
  rainbow_trail: {
    name: '§dTrilha Arco-íris',
    particle: 'minecraft:colored_flame_particle',
    description: 'Rastro colorido místico'
  }
};

// Dar livro ao jogador se não tiver
function giveEffectBook(player) {
  const inventory = player.getComponent('inventory').container;
  let hasBook = false;
  
  for (let i = 0; i < inventory.size; i++) {
    const item = inventory.getItem(i);
    if (item?.typeId === ADDON_BOOK_ID && item?.nameTag === '§6§lLivro de Efeitos Visuais') {
      hasBook = true;
      break;
    }
  }
  
  if (!hasBook) {
    const book = new ItemStack(ADDON_BOOK_ID, 1);
    book.nameTag = '§6§lLivro de Efeitos Visuais';
    book.setLore(['§7Use para escolher efeitos', '§7Criado por §bMutanoX']);
    inventory.addItem(book);
    player.sendMessage('§a[Visual Effects] §fLivro de efeitos adicionado ao inventário!');
  }
}

// Menu de seleção de efeitos
function showEffectsMenu(player) {
  const form = new ActionFormData()
    .title('§6§lEfeitos Visuais')
    .body('§7Escolha um efeito ou remova o atual\n§8Criado por §bMutanoX\n\n§eCurrent: §f' + (player.getDynamicProperty(EFFECTS_DATA) || 'Nenhum'));
  
  Object.entries(VISUAL_EFFECTS).forEach(([key, effect]) => {
    form.button(effect.name + '\n§7' + effect.description);
  });
  
  form.button('§c§lRemover Efeito\n§7Desativar efeito atual');
  
  form.show(player).then(response => {
    if (response.canceled) return;
    
    const effectKeys = Object.keys(VISUAL_EFFECTS);
    if (response.selection === effectKeys.length) {
      player.setDynamicProperty(EFFECTS_DATA, undefined);
      player.sendMessage('§c[Visual Effects] §fEfeito removido!');
    } else {
      const selectedEffect = effectKeys[response.selection];
      player.setDynamicProperty(EFFECTS_DATA, selectedEffect);
      player.sendMessage('§a[Visual Effects] §fEfeito ativado: ' + VISUAL_EFFECTS[selectedEffect].name);
    }
  });
}

// Renderizar efeitos visuais
function spawnEffectParticles(player, effectKey) {
  const effect = VISUAL_EFFECTS[effectKey];
  if (!effect) return;
  
  const loc = player.location;
  
  switch(effectKey) {
    case 'fire_pentagram':
      // Pentagrama de fogo
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72 + Date.now() / 50) * Math.PI / 180;
        const x = loc.x + Math.cos(angle) * 1.5;
        const z = loc.z + Math.sin(angle) * 1.5;
        player.dimension.spawnParticle(effect.particle, {x, y: loc.y + 0.1, z});
      }
      break;
      
    case 'ice_aura':
      // Aura de gelo circular
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45 + Date.now() / 30) * Math.PI / 180;
        const x = loc.x + Math.cos(angle) * 1.2;
        const z = loc.z + Math.sin(angle) * 1.2;
        player.dimension.spawnParticle(effect.particle, {x, y: loc.y + 1, z});
      }
      break;
      
    case 'soul_spiral':
      // Espiral subindo
      const spiralHeight = (Date.now() / 100) % 3;
      const spiralAngle = spiralHeight * 180;
      const sx = loc.x + Math.cos(spiralAngle * Math.PI / 180) * 0.8;
      const sz = loc.z + Math.sin(spiralAngle * Math.PI / 180) * 0.8;
      player.dimension.spawnParticle(effect.particle, {x: sx, y: loc.y + spiralHeight, z: sz});
      break;
      
    case 'electric_ring':
      // Anel elétrico
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 + Date.now() / 20) * Math.PI / 180;
        const x = loc.x + Math.cos(angle) * 1;
        const z = loc.z + Math.sin(angle) * 1;
        player.dimension.spawnParticle(effect.particle, {x, y: loc.y + 1.5, z});
      }
      break;
      
    case 'nature_bloom':
      // Flores ao redor
      for (let i = 0; i < 6; i++) {
        const angle = i * 60 * Math.PI / 180;
        const x = loc.x + Math.cos(angle) * 1.3;
        const z = loc.z + Math.sin(angle) * 1.3;
        player.dimension.spawnParticle(effect.particle, {x, y: loc.y + 0.2, z});
      }
      break;
      
    case 'void_portal':
      // Portal aos pés
      for (let i = 0; i < 10; i++) {
        const angle = (i * 36 + Date.now() / 40) * Math.PI / 180;
        const x = loc.x + Math.cos(angle) * 1.2;
        const z = loc.z + Math.sin(angle) * 1.2;
        player.dimension.spawnParticle(effect.particle, {x, y: loc.y + 0.05, z});
      }
      break;
      
    case 'dragon_breath':
      // Trilha de sopro
      player.dimension.spawnParticle(effect.particle, {x: loc.x, y: loc.y + 0.5, z: loc.z});
      player.dimension.spawnParticle(effect.particle, {x: loc.x + 0.3, y: loc.y + 0.6, z: loc.z});
      player.dimension.spawnParticle(effect.particle, {x: loc.x - 0.3, y: loc.y + 0.6, z: loc.z});
      break;
      
    case 'holy_light':
      // Luz sagrada
      for (let i = 0; i < 4; i++) {
        const angle = (i * 90 + Date.now() / 25) * Math.PI / 180;
        const x = loc.x + Math.cos(angle) * 0.7;
        const z = loc.z + Math.sin(angle) * 0.7;
        player.dimension.spawnParticle(effect.particle, {x, y: loc.y + 2, z});
      }
      break;
      
    case 'dark_smoke':
      // Fumaça sombria
      for (let i = 0; i < 3; i++) {
        const x = loc.x + (Math.random() - 0.5) * 1.5;
        const z = loc.z + (Math.random() - 0.5) * 1.5;
        player.dimension.spawnParticle(effect.particle, {x, y: loc.y + 0.3, z});
      }
      break;
      
    case 'rainbow_trail':
      // Trilha arco-íris
      for (let i = 0; i < 5; i++) {
        const x = loc.x + (Math.random() - 0.5) * 0.8;
        const z = loc.z + (Math.random() - 0.5) * 0.8;
        player.dimension.spawnParticle(effect.particle, {x, y: loc.y + 0.1, z});
      }
      break;
  }
}

// Sistema principal
system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    // Dar livro se não tiver
    giveEffectBook(player);
    
    // Renderizar efeito ativo
    const activeEffect = player.getDynamicProperty(EFFECTS_DATA);
    if (activeEffect) {
      spawnEffectParticles(player, activeEffect);
    }
  }
}, 2);

// Detector de uso do livro
world.beforeEvents.itemUse.subscribe((event) => {
  const player = event.source;
  const item = event.itemStack;
  
  if (item?.typeId === ADDON_BOOK_ID && item?.nameTag === '§6§lLivro de Efeitos Visuais') {
    system.run(() => showEffectsMenu(player));
  }
});

// Mensagem de boas-vindas
world.afterEvents.playerSpawn.subscribe((event) => {
  if (event.initialSpawn) {
    event.player.sendMessage('§6§l[Visual Effects Addon]');
    event.player.sendMessage('§7Addon criado por §bMutanoX');
    event.player.sendMessage('§aUse o livro no inventário para escolher efeitos!');
  }
});

console.warn('§a[Visual Effects] Addon carregado com sucesso! - Por MutanoX');