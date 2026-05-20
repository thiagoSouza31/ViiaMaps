package com.example.viiamaps.Config;

import com.example.viiamaps.repository.AcessibilidadeRepository;
import com.example.viiamaps.repository.EstabelecimentoRepository;
import com.example.viiamaps.repository.entity.Acessibilidade;
import com.example.viiamaps.repository.entity.Estabelecimento;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedEstabelecimentos(
            EstabelecimentoRepository estabelecimentoRepo,
            AcessibilidadeRepository acessibilidadeRepo
    ) {
        return args -> {
            List<Estabelecimento> lugares = List.of(
                // === ORIGINAIS ===
                new Estabelecimento("UniFil - Centro Universitário Filadélfia",
                        "Av. JK, 1626 - Centro, Londrina - PR",
                        -23.31600, -51.17075, null, "/images/unifil.jpg"),
                new Estabelecimento("Terminal Urbano de Londrina",
                        "Av. Arcebispo Dom Geraldo Fernandes, s/n - Centro, Londrina - PR",
                        -23.30805, -51.16068, null, "/images/terminal-central.jpg"),
                new Estabelecimento("Museu Histórico de Londrina Padre Carlos Weiss",
                        "Av. Arcebispo Dom Geraldo Fernandes, 3600 - Centro, Londrina - PR",
                        -23.30796, -51.15977, null, "/images/museu-historico.jpg"),
                new Estabelecimento("Catedral Metropolitana de Londrina",
                        "Av. Rio de Janeiro, 391 - Centro, Londrina - PR",
                        -23.31182, -51.15944, null, "/images/catedral.jpg"),
                new Estabelecimento("Lago Igapó",
                        "Av. Higienópolis - Zona Sul, Londrina - PR",
                        -23.33010, -51.16370, null, "/images/lago-igapo.jpg"),
                new Estabelecimento("Shopping Catuaí Londrina",
                        "Rod. Mábio Gonçalves Palhano, 2380 - Gleba Palhano, Londrina - PR",
                        -23.34248, -51.18557, null, "/images/shopping-catuai.jpg"),
                new Estabelecimento("UEL - Universidade Estadual de Londrina",
                        "Rod. Celso Garcia Cid, PR-445 Km 380, Londrina - PR",
                        -23.32460, -51.20160, null, "/images/uel.jpg"),
                new Estabelecimento("Estádio do Café",
                        "Av. Dez de Dezembro, s/n - Vila Casoni, Londrina - PR",
                        -23.28216, -51.16481, null, "/images/estadio-cafe.jpg"),

                // === NOVOS ===
                new Estabelecimento("UniFil Campus Ipolon",
                        "R. Alagoas, 2015 - Centro, Londrina - PR, 86010-520",
                        -23.31800, -51.17224, null, "/images/unifil-ipolon.jpg"),
                new Estabelecimento("UniFil Campus Canadá",
                        "R. Itararé, 10 - Centro, Londrina - PR, 86082-060",
                        -23.31810, -51.16962, null, "/images/unifil-canada.jpg"),
                new Estabelecimento("Royal Plaza Shopping",
                        "R. Mato Grosso, 310 - Centro, Londrina - PR, 86010-180",
                        -23.31116, -51.15673, null, "/images/royal-plaza-shopping.jpg"),
                new Estabelecimento("Restaurante O Casarão",
                        "Av. Maringá, 899 - Jardim Vitória, Londrina - PR, 86060-000",
                        -23.30808, -51.17828, null, "/images/restaurante-o-casarao.jpg"),
                new Estabelecimento("Isaias Restaurante",
                        "Av. Maringá, 1730 - Vitoria, Londrina - PR, 86060-000",
                        -23.31581, -51.17742, null, "/images/isaias-restaurante.jpg"),
                new Estabelecimento("Bar do Japa",
                        "Av. Duque de Caxias, 2921 - Centro, Londrina - PR, 86071-280",
                        -23.31526, -51.15468, null, "/images/bar-do-japa.jpg"),
                new Estabelecimento("Hospital Evangélico de Londrina",
                        "Av. Bandeirantes, 618 - Ipiranga, Londrina - PR, 86015-900",
                        -23.32495, -51.15914, null, "/images/hospital-evangelico-londrina.jpg"),
                new Estabelecimento("Hospital do Câncer de Londrina",
                        "R. Lucilla Ballalai, 212 - Jardim Petrópolis, Londrina - PR, 86015-520",
                        -23.32889, -51.15347, null, "/images/hospital-do-cancer-londrina.jpg"),
                new Estabelecimento("Aurora Shopping",
                        "Av. Ayrton Senna da Silva, 400 - Palhano 1, Londrina - PR, 86050-460",
                        -23.32755, -51.17862, null, "/images/aurora-shopping.jpg"),
                new Estabelecimento("Havan Londrina",
                        "Av. Me. Leônia Milito, 2121 - Bela Suiça, Londrina - PR, 86050-270",
                        -23.33685, -51.18197, null, "/images/havan-londrina.jpg"),
                new Estabelecimento("Nishikawa Bar",
                        "R. Bauru, 270 - Amaro, Londrina - PR, 86062-320",
                        -23.30028, -51.18712, null, "/images/nishikawa-bar.jpg"),
                new Estabelecimento("R2 Choperia",
                        "R. Fernando de Noronha, 1376 - Centro, Londrina - PR, 86060-410",
                        -23.30682, -51.17699, null, "/images/r2-choperia.jpg"),
                new Estabelecimento("Churrascaria Nativas Grill",
                        "Av. Tiradentes, 1515 - Jardim Shangri-Lá A, Londrina - PR, 86071-000",
                        -23.29768, -51.18952, null, "/images/churrascaria-nativas-grill.jpg"),
                new Estabelecimento("Hospital Dr. Anísio Figueiredo",
                        "R. Odilon Braga, 199 - Sebastiao de Melo César, Londrina - PR, 86084-600",
                        -23.25786, -51.15064, null, "/images/hospital-dr-anisio-figueiredo.jpg"),
                new Estabelecimento("Restaurante Toca do Cateto",
                        "R. Ângelo Mioto, 732 - Heimtal, Londrina - PR, 86079-460",
                        -23.25242, -51.15485, null, "/images/restaurante-toca-do-cateto.jpg"),
                new Estabelecimento("Buffet Planalto",
                        "Av. Tiradentes, 6429 - Pq Ney Braga, Londrina - PR, 86072-000",
                        -23.28562, -51.22574, null, "/images/buffet-planalto.jpg"),
                new Estabelecimento("PUCPR - Câmpus Londrina",
                        "Av. Jockei Club, 485 - Hipica, Londrina - PR, 86067-000",
                        -23.29815, -51.20540, null, "/images/pucpr-londrina.jpg"),
                new Estabelecimento("Assaí Atacadista",
                        "Av. Tiradentes, 4650 - Jardim Shangri-Lá A, Londrina - PR, 86072-000",
                        -23.29114, -51.21141, null, "/images/assai-atacadista.jpg"),
                new Estabelecimento("Supermercado Tonhão Maxi - Loja Santa Rita",
                        "Av. Jules Verne, 410 - Res. Santa Rita V, Londrina - PR, 86072-450",
                        -23.28238, -51.19905, null, "/images/tonhao-maxi-loja-santa-rita.jpg"),
                new Estabelecimento("Mercadão da Prochet",
                        "Av. Harry Prochet, 305 - Jardim Mediterrâneo, Londrina - PR, 86047-040",
                        -23.33930, -51.15674, null, "/images/mercadao-da-prochet.jpg"),
                new Estabelecimento("Unopar Piza",
                        "Av. Paris, 675 - Jardim Piza, Londrina - PR, 86041-120",
                        -23.34883, -51.13759, null, "/images/unopar-piza.jpg"),
                new Estabelecimento("Hospital Zona Sul - Dr. Eulalino Andrade",
                        "R. das Orquídeas, 75 - Ouro Branco, Londrina - PR, 86042-180",
                        -23.36223, -51.14180, null, "/images/hospital-dr-eulalino-ignacio-de-anrade-hospital-zona-sul.jpg"),
                new Estabelecimento("Hospital Unimed Londrina",
                        "Av. dos Expedicionários, 750 - Vale do Arvoredo, Londrina - PR, 86047-590",
                        -23.35506, -51.16596, null, "/images/hospital-unimed.jpg"),
                new Estabelecimento("Boulevard Shopping Londrina",
                        "Av. Theodoro Victorelli, 150 - Carlota, Londrina - PR, 86027-750",
                        -23.31136, -51.14626, null, "/images/boulevard-shopping-londrina.jpg"),
                new Estabelecimento("Bar da Mocidade",
                        "R. Itajaí, 100 - Tietê, Londrina - PR, 86025-450",
                        -23.29989, -51.16656, null, "/images/bar-da-mocidade.jpg"),
                new Estabelecimento("Agrobar Londrina",
                        "Av. Maringá, 1449 - Vitoria, Londrina - PR, 86060-000",
                        -23.31333, -51.17708, null, "/images/agrobar-londrina.jpg"),
                new Estabelecimento("Bar Valentino",
                        "R. Pref. Faria Lima, 486 - Itamarati, Londrina - PR, 86061-320",
                        -23.32030, -51.17991, null, "/images/bar-valentino.jpg"),
                new Estabelecimento("Pizzaria Dom Marino Londrina",
                        "R. Pref. Faria Lima, 1570 - Maringá, Londrina - PR, 86061-450",
                        -23.32003, -51.19025, null, "/images/pizzaria-dom-marino-londrina.jpg"),
                new Estabelecimento("Faculdade Anhanguera Londrina",
                        "R. Edwy Taques de Araújo, 900 - Palhano 2, Londrina - PR, 86047-790",
                        -23.34351, -51.18111, null, "/images/faculdade-anhanguera.jpg"),
                new Estabelecimento("Autódromo Internacional Ayrton Senna",
                        "Av. Henrique Mansano, 777 - Jardim dos Alpes I, Londrina - PR, 86075-000",
                        -23.28211, -51.16878, null, "/images/autodromo-internacional-ayrton-senna.jpg"),
                new Estabelecimento("UniCesumar Londrina",
                        "Av. Santa Mônica, 450 - Franca, Londrina - PR, 86027-610",
                        -23.30233, -51.13795, null, "/images/unicesumar-londrina.jpg"),
                new Estabelecimento("Academia Smart Fit - Cambé",
                        "Av. Gabriel Freceiro de Miranda, 1516 - Jardim Santo Amaro, Cambé - PR",
                        -23.29428, -51.23183, null, "/images/academia-smartfit-cambe-max-santo-amaro.jpg"),
                new Estabelecimento("Expô Londrina",
                        "R. Prata, 55 - Jardim São Francisco de Assis, Londrina - PR, 86067-220",
                        -23.28850, -51.22115, null, "/images/expo-londrina.jpg"),
                new Estabelecimento("Pizzaria Fiorella",
                        "R. Bélgica, 1211 - Tucanos, Londrina - PR, 86046-460",
                        -23.34801, -51.15017, null, "/images/pizzaria-fiorella.jpg"),
                new Estabelecimento("Academia Smart Fit - Av. Maringá",
                        "Av. Maringá, 1765 - Vitoria, Londrina - PR, 86060-000",
                        -23.31576, -51.17655, null, "/images/academia-smartfit-londrina-av-maringa.jpg"),
                new Estabelecimento("Aterro do Lago Igapó",
                        "R. Prof. Joaquim de Matos Barreto, 1146 - Lima Azevedo, Londrina - PR",
                        -23.32687, -51.17886, null, "/images/aterro-do-lago-igapo.jpg"),
                new Estabelecimento("Academia Smart Fit - Quintino",
                        "R. Quintino Bocaiúva, 769 - Centro, Londrina - PR, 86020-150",
                        -23.30448, -51.16367, null, "/images/academia-smartfit-quintino.jpg"),
                new Estabelecimento("Hospital Universitário de Londrina - HU",
                        "Av. Robert Koch, 60 - Operária, Londrina - PR, 86038-350",
                        -23.32466, -51.12470, null, "/images/hospital-universitario-da-universidade-de-londrina.jpg"),
                new Estabelecimento("Cemitério Parque das Oliveiras",
                        "Av. do Café, 225 - Conj. Cafe, Londrina - PR, 86038-000",
                        -23.32167, -51.13363, null, "/images/cemiterio-parque-das-oliveiras.jpg"),
                new Estabelecimento("UTFPR Londrina",
                        "Av. João Miguel Caram, 731 - Pioneiros, Londrina - PR, 86036-700",
                        -23.30444, -51.11479, null, "/images/universidade-tecnologica-federal-do-parana-utfrp.jpg"),
                new Estabelecimento("Burger King Higienópolis",
                        "Av. Higienópolis, 964 - Centro, Londrina - PR, 86020-080",
                        -23.31860, -51.16598, null, "/images/burger-king-higienopolis.jpg"),
                new Estabelecimento("McDonald's Londrina Higienópolis",
                        "Av. Higienópolis, 839 - Centro, Londrina - PR, 86020-040",
                        -23.31717, -51.16450, null, "/images/mc-donalds-higienopolis.jpg"),
                new Estabelecimento("Maximo Villa",
                        "R. Paranaguá, 933 - Centro, Londrina - PR, 86020-030",
                        -23.31373, -51.16901, null, "/images/maximo-villa.jpg"),
                new Estabelecimento("Condomínio Portal do Manacá",
                        "R. Elói Melo Guides, 45 - Conjunto Habitacional Semiramis de Barros, Londrina - PR",
                        -23.26656, -51.14343, null, "/images/condominio-portal-do-manaca.jpg"),
                new Estabelecimento("Super Muffato - Saul Elkind",
                        "Av. Saul Elkind, 2177 - Jardim Planalto, Londrina - PR, 86082-000",
                        -23.25652, -51.15664, null, "/images/super-muffato-londrina-saul.jpg"),
                new Estabelecimento("Max Atacadista - Tiradentes",
                        "Av. Tiradentes, 2200 - Rodocentro, Londrina - PR, 86071-000",
                        -23.29347, -51.19543, null, "/images/max-atacadista-londrina-tiradentes.jpg"),
                new Estabelecimento("Super Muffato - Madre Leônia",
                        "Av. Me. Leônia Milito, 1175 - Bela Suiça, Londrina - PR, 86050-270",
                        -23.33320, -51.16376, null, "/images/super-muffato-londrina-madre.jpg"),
                new Estabelecimento("Londrina Norte Shopping",
                        "R. Américo Deolindo Garla, 224 - Pacaembu, Londrina - PR, 86079-225",
                        -23.28598, -51.15207, null, "/images/londrina-norte-shopping.jpg"),
                new Estabelecimento("Super Muffato Quintino",
                        "R. Quintino Bocaiúva, 1045 - Centro, Londrina - PR, 86020-150",
                        -23.30222, -51.16715, null, "/images/super-muffato-quintino.jpg"),
                new Estabelecimento("Super Muffato - JK",
                        "Av. Juscelino Kubitscheck, 2606 - Ipiranga, Londrina - PR, 86020-005",
                        -23.31893, -51.16011, null, "/images/super-muffato-jk.jpg")
            );

            for (Estabelecimento e : lugares) {
                if (!estabelecimentoRepo.existsByNome(e.getNome())) {
                    Estabelecimento salvo = estabelecimentoRepo.save(e);
                    Acessibilidade ac = new Acessibilidade(false, false, false, false, false, false, false);
                    ac.setEstabelecimento(salvo);
                    acessibilidadeRepo.save(ac);
                } else if (e.getImagemCapa() != null) {
                    estabelecimentoRepo.findByNome(e.getNome()).ifPresent(existing -> {
                        if (existing.getImagemCapa() == null) {
                            existing.setImagemCapa(e.getImagemCapa());
                            estabelecimentoRepo.save(existing);
                        }
                    });
                }
            }
        };
    }
}
