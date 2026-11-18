import type { CollectionEntry } from 'astro:content';

export type Entrada = CollectionEntry<'blog'>;

export const POR_PAGINA = 12;

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const PALETA = ['#4042ff', '#111111', '#6b3fb0', '#c46a3a'];

export function ordenar(entradas: Entrada[]) {
  return [...entradas].sort((a, b) => b.data.date.localeCompare(a.data.date) || a.data.slug.localeCompare(b.data.slug));
}

export function fecha(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return { dia: d, mes: MESES[m - 1] ?? '', anio: y };
}

/** «14 nov 2025». El CSS en mayúsculas lo deja como en el Figma. */
export function fechaCorta(iso: string) {
  const f = fecha(iso);
  return `${f.dia} ${f.mes} ${f.anio}`;
}

export function colorCategoria(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  return PALETA[h % PALETA.length];
}

export function hrefPagina(base: string, pagina: number) {
  const raiz = base.endsWith('/') ? base : `${base}/`;
  return pagina <= 1 ? raiz : `${raiz}pagina/${pagina}/`;
}

export function totalPaginas(cantidad: number) {
  return Math.max(1, Math.ceil(cantidad / POR_PAGINA));
}

export function slicePagina<T>(items: T[], pagina: number) {
  const inicio = (pagina - 1) * POR_PAGINA;
  return items.slice(inicio, inicio + POR_PAGINA);
}

export type CategoriaLista = { slug: string; nombre: string; total: number };

export function categoriasDe(entradas: Entrada[]): CategoriaLista[] {
  const map = new Map<string, CategoriaLista>();
  for (const entrada of entradas) {
    for (const cat of entrada.data.categories) {
      const actual = map.get(cat.slug) ?? { slug: cat.slug, nombre: cat.nombre, total: 0 };
      actual.total += 1;
      map.set(cat.slug, actual);
    }
  }
  return [...map.values()].sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, 'es'));
}

export function porCategoria(entradas: Entrada[], slug: string) {
  return ordenar(entradas.filter((e) => e.data.categories.some((c) => c.slug === slug)));
}
